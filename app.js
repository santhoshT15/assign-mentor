const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mentor = require('./routers/Mentor');
const student = require('./routers/Student');

const port = process.env.PORT;

let app = express();

app.use(cors());
app.use(express.json());

//CONNECTING MONGODB URL
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {useNewUrlParser: true});
const con = mongoose.connection;

//CHECK DB CONNECTION USING TRY CATCH
try{
    con.on("open", () =>{
        console.log("Mongo DB is connected");
    });;
}catch(error){
    console.log("Error" + error);
}

app.use('/mentor', mentor);
app.use('/student', student);

app.listen(port, ()=>{
    console.log("Server is running on port " + port);
});