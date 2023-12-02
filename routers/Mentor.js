

const router = require('express').Router();
const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');
const params = require('params');
const Student =require('../models/Student')
const{ObjectId} = require("mongodb");

// Create a Mentor
router.post('/addMentor', async (req,res) =>{
    const {name, course} = req.body;
    const newMentor = new Mentor({
        "name": name,
        "course": course
    })
    try{
        await newMentor.save();
        res.send(newMentor);
    }catch(err){
        res.status(500).send(err);
    }
});

//All Mentor 
router.get('/all', async (req, res) =>{
    try{
        const mentor = await Mentor.find();

        res.status(200).json(mentor);

    }catch(error){
        res.status(400).json({message: error.message})
    }
})

//Assign Student to Mentor
router.put('/:mentorId/addStudent/:studentId', async(req,res) =>{
    try{
        const {mentorId, studentId} = req.params;
        const mentor = await Mentor.findById(new ObjectId(mentorId));
        const student = await Student.findById(new ObjectId(studentId));

        if(!student || !mentor){
            res.status(404).json({ message: "Not found"});
        }
        
        if(student.mentor){
            res.status(400).json({ message: "Student already assigned" });
        }

        if(!mentor.students){
            mentor.students = [];
        }

        mentor.students.push(student);
        student.mentor = mentor;
        await mentor.save();
        await student.save();
        res.json({ mentor, student});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//Show all Students for a particular Mentor
router.get('/:mentorId/students', async (req,res) =>{
    try{

        const {mentorId} = req.params;
        const mentor = await Mentor.findById(new ObjectId(mentorId)).populate(students);

        res.json({studentList: mentor.students});
    }catch(err){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;