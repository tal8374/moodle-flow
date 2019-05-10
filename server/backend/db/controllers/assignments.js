const express= require('express');
const router= express.Router();
//const db= require('../config/database');
const assignment= require('../models/Assignments');
const model=require('../models');


function returnAll (req,res){
    model.Assignments.findAll()
        .then(users=>res.send(users))
        //res.sendStatus(200);})
        .catch(err=>console.log(err));
}


// return all the assignments in some course
function courseAssigments(req, res){
    //console.log(req.params.course_id);
    const data=req.params.course_id;
    if(data!=null) {
        model.Assignments.find({where: {course_id:data}})
            .then(specificCourse => res.send(specificCourse))
            .catch(err => console.log(err));
    }
    else {
        console.log("no course_id");
        res.sendStatus(200);
    }
}

//router.post('/add', async(req,res)=>
async function addAssignment (req,res){
    //console.log(req.body);
    const data=req.body;
    //console.log(data);
    if (data!=null) {
        /*
        const course_id=data.course_id;
        const user_email=data.user_email;
        const courses = await course.findAll();
        if(course_id in courses){
            const users= await user.findAll();
        }
         */
        console.log(data);
        let {assignment_id, course_id, name, due_date} = data;
        console.log({assignment_id, course_id, name, due_date});
        // insert into table
        model.Assignments.create({assignment_id, course_id, name, due_date})
            .then(newassignment => res.send('true'))
            .catch(err => res.send(err));
    }
    else
    {
        console.log(data);
        res.sendStatus(200);
    }

}

module.exports= {
    returnAll,
    courseAssigments,
    addAssignment,
};
