
/* 
1. 
  Allowing this file to access the required packages
  create constant variables needed to interact with the client and server 
*/

require('dotenv/config');

const express = require('express'),
      mongoose = require('mongoose'),
      Joi = require('joi');

      app = express();

//json parsing for all request
app.use(express.json());


const courses = [{id:1, name: "intro"},
               {id:2, name: "interm"},
               {id:3, name: "adv"}];

//handling the root route/home route
app.get('/', (req, res) => {
    res.send('Hello World!')
});

//handling request on a specific route
app.get('/api/courses', (req, res) => {
    res.json({courses});
});

//get request for specific course by id
app.get('/api/courses/:id', (req, res) => {
    const searchedCourse = courses.find(c => c.id === parseInt(req.params.id));

    if (!searchedCourse) return res.status(404).send('That course could not be found');


    res.status(200).send(searchedCourse);

});

//POST HANDLING
app.post('/api/courses', (req, res) => {

    const { error } = validate_course(req.body);
    
    if (error) return res.status(400).json({ message: error });

    const newCourse = {
        id: courses.length+1,
        name: req.body.name
    }

    courses.push(newCourse);

    res.status(200).json({newCourse: newCourse})

});

//PUT update a post
app.put('/api/courses/:id', (req, res) => {

    const searchedCourse = courses.find(c => c.id === parseInt(req.params.id));

    if (!searchedCourse) return res.status(404).send('That course could not be found');

    const { error } = validate_course(req.body);
    
    if (error) return res.status(400).json({ message: error });

    //now that the potential erros have been handled, update the data
    searchedCourse.name = req.body.name;

    res.send(searchedCourse);

})

//DELETE REQUEST    
app.delete('/api/courses/:id', (req, res) => {
    const searchedCourse = courses.find(c => c.id === parseInt(req.params.id));

    if (!searchedCourse) return res.status(404).send('That course could not be found');

    //now that the potential erros have been handled, delete the desired data
    courses.splice(courses.indexOf(searchedCourse), 1);

    res.send(searchedCourse);

})


//validation middleware
function validate_course(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);

}


//PRACTICE ROUTES
//example query params use case
app.get('/api/query', (req, res) => {

    if (req.query.message == 'true') {

        res.send('You are beautiful');

    } else {

        res.send('no message for you :(');

    }
});

//request a post on a particular month of a particular year
app.get('/api/routeparams/:year/:month', (req, res) => {
    res.json({
        year: req.params.year,
        month: req.params.month
    });
});

//PORT LISTENING
const port = process.env.PORT;

app.listen(port, () => {console.log('Listening on Port:', port);
})