let express = require('express');
let router = express.Router();
let async = require('async');
let User = require('../models/user');
let Conversation = require('../models/conversation');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let multer = require('multer');
let path = require('path');
let jwtDecode = require('jwt-decode');
let ErrorCollection = require('../models/errorCollection');
let rp = require('request-promise');

const secret = '6Ld3m3YUAAAAADD0SuQbfKqnGex4g0Z1fH34o8Oa';

let storage = multer.diskStorage(
    {
        destination: function(req, file, cb) { cb(null, 'src/assets/images/profile-pictures')},
        filename: function(req, file, cb) { cb(null, Date.now() + path.extname(file.originalname))}
    }
);

let upload = multer({ storage: storage });


router.post('/addError', (req, res) => {
  const error = req.body;
  console.log('bodyyyy', error);

  ErrorCollection.find({}, (err, collection) => {
    console.log('collection', collection);
    error.type === 'Server error' ?  collection[0].serverErrors.push(error) : collection[0].serverErrors.push(error);

    collection[0].save((err, collection) => {
      if (err) {
        return res.status(500).json({
          message: "Unable to save collection",
          err: err
        })
      }

      res.status(200).json({
        message: "successfully saved error",
        obj: collection
      })
    })
  })
});


router.get('/checkEmailUniqueness/:email', function(req, res) {
   User.findOne({'email': { $regex: new RegExp("^" + req.params.email.toLowerCase() + "$", "i") }})
       .exec(function(err, user){
           if (err) {
               return res.status(500).json({
                   title: "An error occurred",
                   error: err
               })
           }
           else if (!user) {
               return res.status(200).json({
                       message: 'there is no person with this email address',
                       obj: false
                   }
               )
           }
           res.status(200).json({
               message: "This email address is already taken, please pick another one",
               obj: true
           })
       })
});

router.get('/checkUsername/:username', function(req, res) {
  console.log(req.params.username);
    User.findOne({'username': { $regex: new RegExp("^" + req.params.username.toLowerCase() + "$", "i") }}, function(err, user){
       if (err) {
           return res.status(500).json({
               title: "An error occurred",
               error: err
           })
       }
       else if (!user) {
           return res.status(200).json({
               message: 'there is no person with this username',
               obj: false
               }
           )
       }
       res.status(200).json({
           message: "Someone already has this username, please pick another one",
           obj: true
       })
   })
});

router.get('/getAllErrors', (req, res) => {
  ErrorCollection.find({})
    .exec((err, errors) => {
      if (err) {
        return res.status(500).json({
          notification: "unable to get errors",
          err: err
        })
      }
      res.status(200).json({
        message: "succesfully retrieved the errors",
        obj: errors[0]
      })
  })
})

router.get('/getUserData/:userId', function (req, res) {

    User.findOne({ '_id': req.params.userId })
      .populate({
        path: 'forumPosts'
      })
        .exec(function (err, user) {
            console.log('user', user);
            if (err) {
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }
            res.status(200).json({
                message: "Succesfully retrieved the user data",
                obj: user
            })
        })
});

router.get('/getUserPMs/:userId', function(req, res) {
   Conversation.find({$or: [{user1: req.params.userId}, {user2: req.params.userId}]})
       .populate('messages.from', 'username profilePicture')
       .populate('messages.to', 'username profilePicture')
       .exec(function(err, conversations){
           if (err) {
               return res.status(500).json({
                   title: "An error occurred",
                   error: err
               })
           }
           res.status(200).json({
               message: "successfully received PMs",
               obj: conversations
           })
       })
});

router.post('/isLocationSaved', (req, res) => {

  let user = jwtDecode(req.body.token).user;
  console.log('token test', user);
  console.log('user ID', user._id)

  User.findOne({'_id': user._id.trim()})
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          title: "unable to see if location is saved",
          err: err
        })
      }
      console.log(user);

      res.status(200).json({saved: user.locationSaved});
  })
});

router.post('/sendPM', function(req, res) {
    console.log('reached the back-end');
    // We do this so that we always just have to save the conversation one time.
    let theBiggerOne = req.body.currentUserId >= req.body.destinationUserId ? req.body.currentUserId : req.body.destinationUserId;
    let theSmallerOne = theBiggerOne === req.body.currentUserId ? req.body.destinationUserId : req.body.currentUserId;

    async.waterfall([
        findConversation,
        addMessageToConversation
    ], function(err, conversation){
        if (err) {
            return res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }
        console.log(conversation);
        res.status(200).json({
            message: "successfully sent PM",
            obj: conversation
        })
    });

    function findConversation(cb){
        Conversation.find({
            $and: [{user1: theBiggerOne}, {user2: theSmallerOne}]}, function (err, conversation) {
            cb(null, conversation)
        })
    }

    function addMessageToConversation(conversation, cb) {
        var newMessage = {
            date: new Date(),
            from: req.body.currentUserId,
            to: req.body.destinationUserId,
            msg: req.body.msg
        };

        console.log('newMessage line', newMessage);
                if (!conversation[0]){
                //    create new conversation
                    var newConversation = new Conversation({
                        user1: theBiggerOne,
                        user2: theSmallerOne,
                        messages: [newMessage]
                    });
                //    save new conversation
                    newConversation.save(function(err, savedNewConversation){
                       console.log('savedNewConversation', savedNewConversation);
                        cb(null, savedNewConversation);
                    })
                } else {
                //    there is already a conversation and we need to add the new message to it
                    console.log(' there was already a conversation', conversation);
                    conversation[0].messages.push(newMessage);
                    conversation[0].save(function(err, savedExistingConversation){
                        cb(null, savedExistingConversation)
                    })
                }
    }
    });

router.post('/signup', function(req, res){
  console.log('reached signup back-end');
  createNewUser(req.body, function(result){
        if (!result.success){
            res.status(500).json({
                message: "unable to create User",
                obj: result.err
            })
        } else {
            res.status(200).json({
                message: "successfully created new user",
                obj: result.obj
            })
        }
    });
});

// later I will add the appropriate security for the social media logins, for now I'll stick with the google ID
router.post('/signin', function(req, res){
    var hasUserName = true;

    User.findOne({email: req.body.email}, function(err, user){

        if (!user) {
            return res.status(401).json({
                title: 'Login failed: invalid login credentials',
                notification: 'Invalid login credentials'
            });
        }

        // check if given password is the same as the one provided at signup
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed: invalid login credentials ',
                notification: 'Invalid login credentials'
            })
        }

        // Obtain the token that will later be used at the front-end
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 720000});

        // Update the last time this user signed in
        user.lastLogin = new Date();

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }
            res.status(200).json({
                message: 'Successfully logged in',
                token: token,
                fullName: user.firstName + ' ' + user.lastName,
                hasUsername: hasUserName
            });
        });
    });
});

router.post('/submitUsername', function(req, res) {
    User.findOne({'_id': req.body.currentUserId}, function(err, user){
        user.username = req.body.input;
        user.save(function(err, user){
            if (err) {
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }
            console.log('user', user);
            res.status(200).json({
                message: "successfully received PMs",
                obj: user
            })
        })
    })
});

router.post('/uploadProfilePicture/:userId', upload.single('fileKey'), function(req, res) {
  console.log('reached backend', req.file.filename);
  User.findOne({'_id': req.params.userId}, function(err, user){
        console.log('user test 1', user);
        user.profilePicture.name = req.file.filename;
        console.log('req.file.filename', req.file.filename);
        user.profilePicture.uploaded = true;
        user.save(function(err, user){
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'User created',
                imageUrl: user.profilePicture.name
            });
        })
    })
})

router.get('/validate_captcha/:token', (req, res) => {

  const options = {
    method: 'POST',
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    qs: {
      secret,
      response: req.params.token
    },
    json: true
  };

  rp(options)
    .then(response => res.json(response))
    .catch(() => {});

})

//this function is different depending on whether people log in with social media or with username/password
function createNewUser(userData, onComplete){
    let user;

    user = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: bcrypt.hashSync(userData.password, 10),
            email: userData.email,
            birthDate: userData.birthDate,
            country: userData.country,
            house: userData.house,
            registerDate: new Date()
        });

console.log('user back-end',user);

    user.save(function(err, user) {
        if (err) {
            console.log('possible error', err);
            onComplete({
                success: false,
                err: err
            })
        }
        else {
            console.log('user2', user);
            onComplete({
                success: true,
                obj:user
            })
        }
    });
}

module.exports = router;
