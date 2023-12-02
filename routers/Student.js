const router = require('express').Router();
const mongoose = require('mongoose');
const params = require('params');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const{ObjectId} = require("mongodb");

//Create a Student
router.post('/addStudent', async (req, res) =>{
    const {name, batch} = req.body;
    const newStudent = new Student({
        "name": name,
        "batch": batch
    })
    try{
        await newStudent.save();
        res.send(newStudent);
    }catch(err){
        res.status(500).send(err);
    }
});

//All Student 
router.get('/all', async (req, res) =>{
    try{
        const student = await Student.find();

        res.status(200).json(student);

    }catch(error){
        res.status(400).json({message: error.message})
    }
})

//Assign or Change Mentor for a Student 
router.put('/:studentId/changeMentor/:mentorId', async (req, res) =>{

    const { studentId, mentorId} = req.params;

    try{

        const mentor = await Mentor.findById(new ObjectId(mentorId));
        const student = await Student.findById(new ObjectId(studentId));

        if(!student || !mentor){
            res.status(404).json({ message: "Not found" });
        }

        if(student.mentor){
            student.mentor.students.pull(student);
            await student.mentor.save();
        }

        if (!mentor.assignedStudent) {
            mentor.assignedStudent = [];
        }

        mentor.students.push(student);
        student.mentor = mentor;
        await student.save();
        await mentor.save();
        res.json()
        res.json({ mentor, student });
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
});

//Show perviously assigned Mentor for a Student
router.get('/:studentId/previousMentor', async (req, res) =>{
    try{      
        const { studentId } = req.params;
        const student = await Student.findById(new ObjectId(studentId)).populate("mentor", "name");
         
        res.json({ previousMentor: student.mentor });
    }catch(error){
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;