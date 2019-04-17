const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

//database connection
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
// Use your own mlab account!!!
var mongourl = 'mongodb://rockie2695:26762714Rockie@ds057816.mlab.com:57816/rockie2695_mongodb';

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
// create a GET route
app.get('/', (req, res) => {
    res.send({
        express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'
    });
});

app.get('/start', (req, res) => {
    //check if no world ,create world

    //add to world table {energy:"5000"}
    //add to life table {producer:true,move:1,energy:1,number:1}
    MongoClient.connect(mongourl, {
        useNewUrlParser: true
    }, function (err, db) {
        insert(db, {
            energy: "5000"
        }, 'world', function (err, result) {
            console.log(err, result)
        })
        insert(db, {
            producer: true,
            move: 1,
            energy: 1,
            number: 1
        }, 'life', function (err, result) {
            console.log(err, result)
        })
    })
    //if have world,get all 
})

function insert(db, query, table, callback) {
    db.db().collection(table).insertOne(query, function (err, result) {
        callback(err, result);
    });
}