const express = require('express');
const bodyParser = require('body-parser');
const Soldier = require('./models/Soldier');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const { json } = require('express');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var Deque = require("collections/deque");
const router = express.Router();
const LIMIT_PER_DOC = 20;
//GET 
/*const getDirectSubroutines = (superior_id, sortField, order, skip) => {
    if (sortField == '')
}*/

//fetch all soldiers with three states of order: default, ascending, descending
router.get('/fetchSoldiers', async (req, res) => {
    
    let superior_id = isDefined(req.query.superior_id) && String(req.query.superior_id);
    let sortField = isDefined(req.query.sortField) && String(req.query.sortField);
    let order = isDefined(req.query.order) ? String(req.query.order) : '';
    let filter = isDefined(req.query.filter) ? req.query.filter.toString() : '';
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
    console.log("sortField:" + sortField + ", sortOrder: " + order + ", skip:" + skip + ", filter: " + `/${filter}/`);
    //console.log("type of sortField: " + typeof sortField);
    //const sortType = sortField === 'direct_subordinates' ? 'sortByCount' : "sort";
    //console.log("sortType:"  + sortType);
    //if sortfield === direct_subordinates, set aggregate separately
    
    try {
        const options = {
            sort: {[sortField] : order},
            populate: 'superior',
            offset: skip,
            limit: 10
        }
        if (isUndefined(superior_id)) {
            let filterQuery = isUndefined(req.query.filter) ? {} : 
            {
                $or: [
                    {name : new RegExp(filter, 'i')},
                    {rank : new RegExp(filter, 'i')},
                    {sex : new RegExp(filter, 'i')},
                    {startDate : new RegExp(filter, 'i')},
                    {phone : new RegExp(filter, 'i')},
                    {email : new RegExp(filter, 'i')},
                    {ds_num : {$eq : isInteger(filter) ? +filter : Number.MAX_SAFE_INTEGER}}
                ]
            };
            let soldiers = await Soldier.paginate(filterQuery, options, (err, result) => {
                res.send(result);
            })
        } else {
            console.log("looking for direct subordinates");
            let filterQuery = isUndefined(req.query.filter) ? {superior: superior_id} : 
            {
                $and: [
                    {superior: superior_id},
                    {$or: [
                        {name : new RegExp(filter, 'i')},
                        {rank : new RegExp(filter, 'i')},
                        {sex : new RegExp(filter, 'i')},
                        {startDate : new RegExp(filter, 'i')},
                        {phone : new RegExp(filter, 'i')},
                        {email : new RegExp(filter, 'i')},
                        {ds_num : {$eq : isInteger(filter) ? +filter : Number.MAX_SAFE_INTEGER}}
                    ]}
                ]
                
            };
            let soldiers = await Soldier.paginate(filterQuery, options, (error, result) => {
                res.send(result);
            })
        }
    } catch(error) {
        console.log(error)
        res.status(404).send({error: "failed to fetch soldiers"});
    }
})

router.get('/fetchSuperiorCandidates', async (req, res) => {
    let id = req.query.id;
    try {
        let superiorCandidates;
        if (isUndefined(id)) {
            superiorCandidates = await Soldier.find({});
            res.send(superiorCandidates);
        } else {
            superiorCandidates = await getAllValidSuperiorCandidatesById(id);
            res.send(superiorCandidates);
        }
    } catch (error) {
        res.status(404).send({error : {error}});
    }
});
//do bfs to get all of the children's id, find all the soldiers that are not in the array'
//initialization: push to the end(current id)
//expansion
//save each poped id to an array, find curSoldier's direct subordinates by searching for the superior_id,
//push all of them to the end of queue
//termination: stop when queue is empty, by this time, all subordinates of the soldier should stored in the array

//check through all the soldiers, return all of them except for the one in the array
const getAllValidSuperiorCandidatesById = async (id) => {
    let queue = new Deque();
    let childrenArray = [];
    queue.push(id);
    while (queue.length !== 0) {
        let curId = queue.shift();
        let curSoldier = await Soldier.findById(curId);
        childrenArray.push(curId);
        let curChildren = await Soldier.find({superior: curId});
        for (let child of curChildren) {
            queue.push(child._id);
        }
        console.log("curChildren.length" + curChildren.length + ", queue.length" + queue.length);
    }
    console.log(childrenArray);
    let validSuperiorCandidates = await Soldier.find({_id: {$nin: childrenArray}});
    return validSuperiorCandidates;
}

//get subordinates based on id
router.get('/fetchDirectSubordinates/:id', async (req, res) => {
    try {
        const skip =
            req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
        const soldier = await Soldier.findById(req.params.id);
        const populated_soldier = await soldier.
            populate({
                path: 'direct_subordinates', 
                options: {
                    skip, 
                    limit: LIMIT_PER_DOC 
                }
            }).
            execPopulate();
        const direct_subordinates = populated_soldier.direct_subordinates;
        res.send(direct_subordinates);
    } catch (err) {
        if (err) res.status(404).send({error : `${err}`});
    }
})

//fetch a soldier with id
router.get('/fetchSoldier/:id', async (req, res) => {
    try {
        const soldier = await Soldier.findOne( {_id : req.params.id} );
        res.send(soldier);
    } catch (err) {
        if (err) res.status(404).send(err);
    }
})



//POST
//create a new soldier
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
        startDate: moment.utc(new Date(req.body.startDate)).format('L'), //might need validation
        phone: req.body.phone,
        email: req.body.email,
        superior: req.body.superior,
        direct_subordinates: [],
        ds_num: 0,
        imageUrl: req.body.imageUrl ? req.body.imageUrl : "/photos/default_avatar.jpg"
    })
    await newSoilder.save(async (err) => {
        if (err) res.status(404).send(err);
        if (req.body.superior) {
            try {
                addDirectSubroutine(req.body.superior, newSoilder._id);  
            } catch {
                res.status(404).send({error: "failed add superior"});
            }
        }
    });
    res.send(newSoilder);
});


//PUT
//update/edit a soldier with id
router.put('/editSoldier/:id', async (req, res) => {
    try {
        const soldier = await Soldier.findById(req.params.id);
        //edit information except for direct subroutine
        soldier.name = req.body.name;
        soldier.rank = req.body.rank;
        soldier.sex = req.body.sex;
        soldier.startDate = moment.utc(new Date(req.body.startDate)).format('L'); //might need validation
        soldier.phone = req.body.phone;
        soldier.email = req.body.email;
        soldier.imageUrl = req.body.imageUrl;
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
        if (soldier.superior.toString() !== cur_superior_id.toString()) {
            if (isUndefined(soldier.superior) && !isUndefined(cur_superior_id)) {
                //console.log("from undefined to defined");
                addDirectSubroutine(cur_superior_id, soldier._id);
            } else if (!isUndefined(soldier.superior) && isUndefined(cur_superior_id)) {
                //console.log("from defined to undefined");
                deleteDirectSubroutine(soldier.superior, soldier._id);
            } else {
                //console.log("from defined to defined");
                addDirectSubroutine(cur_superior_id, soldier._id);
                deleteDirectSubroutine(soldier.superior, soldier._id);
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

//DELETE
//delete an existing soldier
router.delete("/deleteSoldier/:id", async (req, res) => {
    try {
        const soldier_toBeDeleted = await Soldier.findById(req.params.id);
        console.log("soldier to be deleted found: " + soldier_toBeDeleted.name);
        if (isUndefined(soldier_toBeDeleted.superior)) {
            console.log("superior is undefined")
            for (let ds_id of soldier_toBeDeleted.direct_subordinates) {
                let id = ds_id.toString();
                console.log("ds_id deleting: ", id);
                let subordinate = await Soldier.findById(id);
                subordinate.superior = undefined;
                await subordinate.save();
            }
        } else {
            console.log("superior is defined")
            let superior_id = soldier_toBeDeleted.superior;
            for (let ds_id of soldier_toBeDeleted.direct_subordinates) {
                let id = ds_id.toString();
                console.log("ds_id deleting: ", id);
                let subordinate = await Soldier.findById(id);
                subordinate.superior = superior_id;
                addDirectSubroutine(superior_id, subordinate._id);
                await subordinate.save();
            }
            deleteDirectSubroutine(superior_id, soldier_toBeDeleted._id);
        }
        //go to the it's own direct subroutine and reset all of their superior to undefined
        //console.log("before looping through soldier's ds")
        //console.log(soldier_toBeDeleted.direct_subordinates);
        
        await Soldier.deleteOne(soldier_toBeDeleted);
        //console.log("successfully deleted");
        res.status(204).send({message: "successfully deleted"});
    } catch (err) {
        res.status(404).send({error: "problem deleting soldier"});
    }
})

//delete all the soldiers (only develop this for developing convinience)
router.delete("/deleteAll", async (req, res) => {
    try {
        await Soldier.deleteMany({});
        res.status(204).send("successfully deleted all the soldiers");
    } catch (err) {
        res.status(404).send({message : "didn't delete all the soldiers successfully"});
    }
})

const isInteger = (value) => {
    if(parseInt(value,10).toString()===value) {
      return true
    }
    return false;
}
//helper funct
const isUndefined = (value) => {
    return (!value || typeof value == undefined || value === 'undefined' || value == null || value.length == 0 || value == "");
}

//helper funct
const isDefined = (value) => {
    if (!value || typeof value == undefined || value === 'undefined' || value == null || value.length == 0 || value == "") {
        return false;
    } else {
        return true;
    }
}

const deleteDirectSubroutine = async (superior_id, soldier_id) => {
    try {
        const superior = await Soldier.findById(superior_id);
        let index;
        let found = superior.direct_subordinates.some(function(ds, idx) {
            if (ds.toString() === soldier_id.toString()) {
                index = idx;
                return true;
            }
        })
        console.log(superior.direct_subordinates);
        if (found) {
            superior.direct_subordinates.splice(index, 1);
            superior.ds_num = superior.direct_subordinates.length;
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
        superior.ds_num = superior.direct_subordinates.length;
        await superior.save();
    } catch(error) {
        console.log("add direct subroutine failed")
    }
}
module.exports = router;