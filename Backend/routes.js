const express = require('express');
const bodyParser = require('body-parser');
const Soldier = require('./models/Soldier');
const mongoose = require('mongoose');
const moment = require('moment');
const router = express.Router();
router.get('/fetchSoldiers', async (req, res) => {
    const soldiers = await Soldier.find();
    res.send(soldiers);
})

router.post('/addNewSoldier', bodyParser.urlencoded({ extended: false}), async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message : 'content cnanot be empty!'});
        return;
    }
    console.log("added new soilder" + req.body.name);
    //create a new soldier
    const newSoilder = new Soldier({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.first_name,
        rank: req.body.rank,
        sex: req.body.sex,
        startDate: moment.utc(req.body.startDate), //might need validation
        phone: req.body.phone,
        email: req.body.email,
        superior: req.body.superior_id,
        direct_subordinates: []
    })
    console.log()
    await newSoilder.save(async (err) => {
        if (err) return handleError(err);
        if (req.body.superior_id) {
            const superior = await Soldier.findById(req.body.superior_id);
            superior.direct_subordinates.push(newSoilder._id);
            await superior.save(function (err) {
                if (err) return handleError(err);
            })
            console.log("superior's name is:" + superior.name);
        }
    });
    res.send(newSoilder);
});
/*
const handleError = (err) => {
    console.log("An error occured while saving data", err);
}*/

module.exports = router;