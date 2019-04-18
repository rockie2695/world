const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const open = require('open');

//database connection
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
// Use your own mlab account!!!
var mongourl = "mongodb+srv://rockie2695:26762714Rockie@cluster-test-cw81o.gcp.mongodb.net/test?retryWrites=true";
const mongoConectClient = new MongoClient(mongourl, { useNewUrlParser: true });
// console.log that your server is up and running
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    if (port == 8080) {
        (async () => {
            // Specify app arguments
            await open('http://localhost:' + port, {
                app: "chrome"
            });
        })();
    }
});
// create a GET route
app.get('/', (req, res) => {
    res.send({
        express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'
    });
});
app.get('/test', (req, res) => {
    mongoConectClient.connect(err => {
        if (err) {
            console.log(err)
        } else {

        }

    });

})
app.get('/start', (req, res) => {
    //check if no world ,create world

    //add to world table {energy:"5000"}
    //add to life table {producer:true,move:1,energy:1,number:1}
    mongoConectClient.connect(err => {
        if (err) {
            console.log(err)
        } else {
            var findLife = new Promise(function (resolve, reject) {
                let collection = mongoConectClient.db("rockie2695_mongodb").collection("life");
                collection.find().count(function (err, count) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(count)
                    }
                })
            })
            var createWorld = function () {
                return new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("world");
                    // perform actions on the collection object
                    insert(collection, {
                        energy: "5000"
                    }, function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }

                    })
                })
            }
            var createLife = function (id) {
                return new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("life");
                    // perform actions on the collection object
                    insert(collection, {
                        producer: true,
                        move: 1,
                        energy: 1,
                        number: 1,
                        worldid: new mongodb.ObjectID(id)
                    }, function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }

                    })
                })
            }

            findLife
                .then(function (count) {
                    if (count == 0) {
                        return createWorld()
                            .then(function (result) {
                                return createLife(result.ops._id)
                            })
                    } else if (count > 0) {
                    }
                })
                .then(function (result) {
                    res.send("ok")
                })
                .catch(function (error) {
                    res.send(error)
                })/*.finally(function () {
                    // 己結算 (己履行[fulfilled]或己拒絕[rejected])
                    mongoConectClient.close()
                });*/
        }

    });

    //if have world,get all 
})

function insert(collection, query, callback) {
    collection.insertOne(query, function (err, result) {
        callback(err, result);
    });
}