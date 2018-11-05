let express = require('express');
let router = express.Router();
let async = require("async");
let jwtDecode = require('jwt-decode');
let Location = require('../models/location');
let reusableCode  = require('../classes/reusableFunctions');


router.get('/getThreeClosestPlayers/:userId', function(req, res) {

    var userId = req.params.userId;

    async.waterfall([
       findOwnLocationObject,
       findClosestPlayers

    ], function (err, fourClosest) {

      if (err) {
            res.status(500).json({
                title: "An error occurred",
              notification: `
              We were unable to load the locations of players close to you. 
              Please refresh the page to try again.
              If you denied location permission, please change your browser settings to make use of this section
              `,
                error: err
            })

        } if (fourClosest) {

        let result = filterOwnLocation(fourClosest, userId);


        res.status(200).json({
          message: "successfully retrieved the three closest players",
          obj: {
            currentUser: result.currentUser[0],
            threeClosest: result.threeClosest
          }
        })
      }

    });

    function findOwnLocationObject(cb){
        Location.findOne({'user': userId}, function(err, CULocationObj) {
            if (!CULocationObj) {
              cb({
                notification: "location object hasn't been saved yet"
                })
            }
            else {cb(null, CULocationObj)};
        });
    }
    function findClosestPlayers(locationUser, cb) {

        let fourClosest = [];
        const locationUserLat = locationUser.latitude;
        const locationUserLng = locationUser.longitude;
        Location.find({})
            .populate('user')
            .exec(function(err, locations){
                locations.forEach(function(location){

                    // We compare our distance with the other distances and end up with the three closest players
                    let distance = reusableCode.getDistanceFromLatLngInKm(locationUserLat, locationUserLng, location.latitude, location.longitude);
                    let distanceObject = {
                        distanceInKMS: distance,
                        locationObj: location
                    };
                    if (fourClosest.length < 5) {
                        fourClosest.push(distanceObject);
                        fourClosest.sort(function(a, b){
                            return a.distanceInKMS - b.distanceInKMS;
                        });
                    } else {
                        var alreadyReplaced = false;

                        fourClosest.forEach(function(currentClosestObj, index){
                            // We only want to replace the highest distance
                            if (distanceObject.distanceInKMS < currentClosestObj.distanceInKMS && alreadyReplaced === false) {
                              fourClosest.splice(index, 0, distanceObject);
                              // remove the largest distance, so that we keep having 4 locations
                              fourClosest.splice(fourClosest.length-1, 1);
                                alreadyReplaced = true
                            }
                        });
                    }
                });
                cb(null, fourClosest);
            })
    }


  function filterOwnLocation(fourClosest, userId) {
      console.log('id', fourClosest[0].locationObj.user);
      const index = fourClosest.findIndex((location, i) => userId == location.locationObj.user._id);

      const currentUser = fourClosest.splice(index, 1);

      return {currentUser, threeClosest: fourClosest};
  }
});

router.post('/saveLocation', function(req, res){


    const decodedToken = jwtDecode(req.body.token);

//    Look if the user has already a saved location in the database. If so, change the existing lat and lng, if not create a new one
    Location.findOne({'user': decodedToken.user._id})
      .exec(function(err, existingLocation) {
        if (err) {
            res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }
        // if the current user has no existing location data, we create new location document
        if (existingLocation === null) {
            const newLocation = new Location({
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                user: decodedToken.user._id
            });

            newLocation.save(function(err, newLoc){
                console.log('completed the save');
                if (err) {
                    return res.status(500).json({
                        title: "An error occurred here",
                        error: err,
                        notification: 'Unable to save Location, false data'

                    })
                }
                Location.populate(newLoc, {path: 'user'}, function(err, popNewLoc) {
                  if (err) {
                    return res.status(500).json({
                      title: "Unable to populate",
                      error: err,
                      notification: 'Unable to save Location, false data'
                    })
                  }
                  else if (!popNewLoc.user.locationSaved) {
                    // Change the status of locationChanged to true so users can access the section of the web page
                    popNewLoc.user.locationSaved = true;
                    popNewLoc.user.save((err, user) => {
                      return res.status(200).json({
                        message: "succesfully saved new location",
                        obj: popNewLoc
                      })
                    })
                  } else {
                    return res.status(200).json({
                      message: "succesfully saved new location",
                      obj: popNewLoc
                    })
                  }
                });

            })
        }
        // there was already a location connected to this user and now
        // we're changing the coordinates
        if (existingLocation){
            existingLocation.latitude = req.body.latitude;
            existingLocation.longitude = req.body.longitude;

            existingLocation.save(function (err, changedLoc) {
                if (err) {
                    res.status(500).json({
                        title: "An error occurred",
                        error: err
                    })
                }
                res.status(200).json({
                    message: "succesfully changed location",
                    obj: changedLoc
                })
            });
        }
    });
});

router.get('/getLocations/:token', function(req, res) {

    const decodedToken = jwtDecode(req.params.token);

    async.waterfall([
        getAllLocations,
        filterOutOwnLocation
    ], function(err, locationCollection, myLocation) {
        if (err) {
            return res.status(500).json({
                title: "An error occurred",
                error: err,
                notification: "We were unable to load the locations. Please try again later"
            })
        }
          res.status(200).json({
          locationCollection: locationCollection,
          myLocation: myLocation
        })
    });

    function getAllLocations(cb) {
        Location.find({})
            .populate({
                path: 'user'
            })
            .exec(function(err, locationDocs){
              cb(null, locationDocs)
            })
    }


    function filterOutOwnLocation( locations, cb) {
        let myIndex;
        let myLoc = locations.filter( (doc, index) => {
            if (doc.user._id == decodedToken.user._id) {
              myIndex = index;
            }
            return doc.user._id == decodedToken.user._id
        });
        locations.splice(myIndex, 1);

        cb(null, locations, myLoc)
    }
});


module.exports = router;
