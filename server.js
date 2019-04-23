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
const mongoConectClient = new MongoClient(mongourl, {
    useNewUrlParser: true
});
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
    doAllTheThings(res)
})

function doAllTheThings(res) {
    //check if no world ,create world
    var world, life, eachLife, combineLife
    //add to world table {energy:5000}
    //add to life table {producer:true,move:1,energy:1,number:1}
    mongoConectClient.connect(err => {
        if (err) {
            console.log(err)
        } else {
            var findLife = new Promise(function (resolve, reject) {
                let collection = mongoConectClient.db("rockie2695_mongodb").collection("life");
                collection.find().toArray( /*).count(*/ function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
            var findWorld = function () {
                return new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("world");
                    collection.find().toArray( /*).count(*/ function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    })
                })
            }
            var createWorld = function () {
                return new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("world");
                    // perform actions on the collection object
                    insert(collection, {
                        energy: 5000
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
                console.log(id)
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
            var updateLife = function (element) {
                return new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("life");
                    // perform actions on the collection object
                    update(collection, {
                        $and: [{
                                worldid: new mongodb.ObjectID(element.worldid)
                            },
                            {
                                _id: new mongodb.ObjectID(element._id)
                            }
                        ]
                    }, {
                        $set: {
                            number: element.number
                        }
                    }, function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result)
                        }
                    })
                })
            }
            var insertLife = function (element) {
                new Promise(function (resolve, reject) {
                    let collection = mongoConectClient.db("rockie2695_mongodb").collection("life");
                    insert(collection, {
                        producer: element.producer,
                        move: element.move,
                        energy: element.energy,
                        number: element.number,
                        worldid: new mongodb.ObjectID(element.worldid)
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
                .then(function (result) {
                    if (result.length === 0) {
                        return createWorld()
                            .then(function (result) {
                                console.log(result.ops)
                                return createLife(result.ops[0]._id)
                            })
                    } else if (result.length > 0) {
                        life = result
                        eachLife = []
                        return findWorld() //if have world,get all 
                            .then(function (result) {
                                world = result
                            }).then(function () { //divide life to eachLife
                                for (let i = 0; i < life.length; i++) {
                                    let worldFromWorldid
                                    for (let k = 0; k < world.length; k++) {
                                        if (world[k]._id.equals(life[i].worldid)) {
                                            worldFromWorldid = world[k]
                                            break;
                                        }
                                    }
                                    console.log(worldFromWorldid)
                                    for (let j = 0; j < life[i].number; j++) {
                                        eachLife.push({
                                            _id: life[i]._id,
                                            producer: life[i].producer,
                                            move: life[i].move,
                                            energy: life[i].energy,
                                            worldid: life[i].worldid,
                                            maxEnergy: worldFromWorldid.energy,
                                            number: 1
                                        })
                                    }
                                }
                                shuffleArray(eachLife)
                                console.log(eachLife)
                            }).then(function () { //eachLife action, such as copy itself
                                for (let m = 0, eachLifeLength = eachLife.length; m < eachLifeLength; m++) {
                                    if (eachLife[m].producer) {
                                        let useEnergy = 0
                                        for (let n = 0; n < eachLife.length; n++) { //find how many producer use energy
                                            if (eachLife[n].worldid.equals(eachLife[m].worldid) && eachLife[n].producer) {
                                                useEnergy += eachLife[n].energy
                                            }
                                        }
                                        if (useEnergy < eachLife[m].maxEnergy) {
                                            eachLife.push(eachLife[m])
                                        }
                                    }
                                }
                                console.log("eachLife", eachLife)
                            }).then(function () { //combine eachLife to combinLife
                                combineLife = []
                                for (let i = 0; i < eachLife.length; i++) {
                                    if (eachLife[i].number > 0) {
                                        let result = combineLife.findIndex(element => element['_id'].equals(eachLife[i]._id) && element['worldid'].equals(eachLife[i].worldid))
                                        if (result === -1) {
                                            combineLife.push({
                                                _id: eachLife[i]._id,
                                                worldid: eachLife[i].worldid,
                                                number: 1
                                            })
                                        } else {
                                            combineLife[result].number++
                                        }
                                    }
                                }
                                console.log(combineLife)
                            }).then(function () { //compare combineLife and life, see which life should update (number)
                                return new Promise(function (resolve, reject) {
                                    let promises = []
                                    for (let i = 0; i < combineLife.length; i++) {
                                        let result = life.findIndex(element => element['_id'] == combineLife[i]._id && element['worldid'] == combineLife[i].worldid)
                                        if (result === -1) {
                                            //insert
                                            promises.push(
                                                insertLife(combineLife[i])
                                            )
                                        } else {
                                            //update
                                            console.log("update")
                                            promises.push(
                                                updateLife(combineLife[i])
                                            )
                                        }
                                    }
                                    Promise.all(promises).then(
                                        resolve(promises)
                                    ).catch(function (e) {
                                        reject(promises)
                                    })
                                })
                            })
                    }
                })
                .then(function (result) {
                    res.send("ok")
                })
                .catch(function (error) {
                    console.log(error)
                    res.send(error)
                })
            /*.finally(function () {
                                // 己結算 (己履行[fulfilled]或己拒絕[rejected])
                                mongoConectClient.close()
                            });*/
        }

    });
}

function insert(collection, query, callback) {
    collection.insertOne(query, function (err, result) {
        callback(err, result);
    });
}

function update(collection, where, set, callback) {
    collection.updateOne(where, set, function (err, result) {
        callback(err, result);
    });
}

function shuffleArray(array) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}