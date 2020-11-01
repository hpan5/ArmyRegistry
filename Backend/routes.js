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

router.get('/fetchSoldier/:id', async (req, res) => {
    try {
        const soldier = await Soldier.findOne( {_id : req.params.id} );
        res.send(soldier);
    } catch (err) {
        if (err) res.status(404).send(err);
    }
})

router.put('/editSoldier/:id', async (req, res) => {
    try {
        const soldier = await Soldier.findById(req.params.id);
        //edit information except for direct subroutine
        soldier.name = req.body.name;
        soldier.rank = req.body.rank;
        soldier.sex = req.body.sex;
        soldier.startDate = moment.utc(req.body.startDate); //might need validation
        soldier.phone = req.body.phone;
        soldier.email = req.body.email;
        //if superior has changed
        //case1: superior has change from undefined to defined
            //add self to new superior's subroutine
        //case2:  superior has change from defined to undefined
            //remove the itself from current superiors direct subroutine array
        //case3: suuperior has change from one to the other
            //add self to new superior's subroutine
        //  1. remove the itself from current superiors direct subroutine array
        //  2. add self to new superior's subroutine
        let cur_superior_id = req.body.superior;
        console.log("soldier.superior: " + JSON.stringify(soldier.superior) + "cur_superior_id: " + JSON.stringify(cur_superior_id));
        if (soldier.superior !== cur_superior_id) {
            console.log("soldier's superior needs to change");
            console.log("soldier.superior is undefined ? " + isUndefined(soldier.superior));
            console.log("cur_superior_id is undefined ? " + isUndefined(cur_superior_id));
            if (isUndefined(soldier.superior) && !isUndefined(cur_superior_id)) {
                console.log("from undefined to defined");
                await addDirectSubroutine(cur_superior_id, soldier._id);
            } else if (isUndefined(soldier.superior) === false && isUndefined(cur_superior_id) === true) {
                console.log("from defined to undefined");
                await deleteDirectSubroutine(soldier.superior, soldier._id);
            } else {
                console.log("from defined to defined");
                await addDirectSubroutine(cur_superior_id, soldier._id);
                await deleteDirectSubroutine(soldier.superior, soldier._id);
            }
            soldier.superior = cur_superior_id;
        } else {
            console.log("superior id is the same");
        }
        await soldier.save();
        res.send(soldier);
    } catch (err) {
        if (err) res.status(404).send(err);
    }
})

const isUndefined = (value) => {
    return (!value || typeof value == undefined || value === 'undefined' || value == null || value.length == 0 || value == "");
}

router.post('/addNewSoldier', bodyParser.urlencoded({ extended: false}), async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({message : 'content cnanot be empty!'});
        return;
    }
    console.log("added new soilder: " + req.body.name);
    //create a new soldier
    const newSoilder = new Soldier({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rank: req.body.rank,
        sex: req.body.sex,
        startDate: moment.utc(req.body.startDate), //might need validation
        phone: req.body.phone,
        email: req.body.email,
        superior: req.body.superior,
        direct_subordinates: []
    })
    console.log()
    await newSoilder.save(async (err) => {
        if (err) res.status(404).send(err);
        if (req.body.superior) {
            try {
                await addDirectSubroutine(req.body.superior, newSoilder._id);  
            } catch {
                res.status(404).send({error: "failed add superior"});
            }
        }
    });
    res.send(newSoilder);
});

const deleteDirectSubroutine = async (superior_id, soldier_id) => {
    try {
        const superior = await Soldier.findById(superior_id);
        //console.log("deleting superior found: " + superior.name);
        //console.log("soldier_id" + soldier_id);
        let index;
        let found = superior.direct_subordinates.some(function(ds, idx) {
            index = idx;
            return ds == soldier_id;
        })
        //console.log("index: " + index);
        if (index >= 0) {
            superior.direct_subordinates.splice(index, 1);
        } else {
            console.log(" direct subroutine not existed");
        }
        await superior.save();
        console.log("deleted superior's name is:" + superior.name);
    } catch(error) {
        console.log("delete direct subroutine failed  ", error);
    }
}


const addDirectSubroutine = async (superior_id, soldier_id) => {
    try {
        const superior = await Soldier.findById(superior_id);
        superior.direct_subordinates.push(soldier_id);
        await superior.save();
        console.log("superior's name is:" + superior.name);
    } catch(error) {
        console.log("add direct subroutine failed")
    }
}

router.delete("/delete/:id", async (req, res) => {
    try {
        const soldier_toBeDeleted = await Soldier.findById(req.params.id);
        if (!isUndefined(soldier_toBeDeleted.superior)) {
            console.log("deleteing superiors's ds")
            await deleteDirectSubroutine(soldier_toBeDeleted.superior, soldier_toBeDeleted._id);
        }
        await Soldier.deleteOne(soldier_toBeDeleted);
        res.status(204).send("successfully deleted");
    } catch (err) {
        res.status(404).send({error: "problem deleting soldier"});
    }
})

router.delete("/deleteAll", async (req, res) => {
    try {
        await Soldier.deleteMany({});
        res.status(204).send("successfully deleted all the soldiers");
    } catch (err) {
        res.status(404).send({message : "didn't delete all the soldiers successfully"});
    }
})

module.exports = router;