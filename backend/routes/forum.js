var express = require('express');
var router = express.Router();
var ForumPost = require("../models/forumPost");
var async = require("async");
var User = require('../models/user');
var jwtDecode = require('jwt-decode');
var ForumSection = require('../models/forumSection');
var ForumReply = require('../models/forumReply');
var ForumCount = require('../models/forumCount');
var SubViewCount = require('../models/subViewCount');

router.post('/addPost', function(req, res){
    var decodedToken = jwtDecode(req.body.token);

    var newPost = new ForumPost({
        user: decodedToken.user._id,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category
    });

    console.log(newPost);

    async.waterfall([
        saveNewPost,
        addPostToUser,
        addPostToCategoryAndEditLastPost
    ], function(err, post, user){
        if (err) {
            res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }
        res.status(200).json({
            message: "successfully added forum message",
            obj: post
        })

    });

    function saveNewPost(cb){
        newPost.save(function(err, post) {
          console.log('our newly saved post', post);
           post.populate('user', 'username profilePicture', (err, post) => {
             cb(null, post)
           })
        });
    }

    function addPostToUser(post, cb){
        console.log(post);

        // REMINDER: I have to erase earlier made additions to this user method that are not longer valid
        User.findOne({'_id': post.user}, function(err, user){
            console.log(user);
            user.forumPosts.push(post._id);
            user.save(function(err, user){
                cb(null, post, user);
            });
        });
    }

    function addPostToCategoryAndEditLastPost(post, user, cb) {

        ForumSection.findOne({'name': post.category}, function (err, category) {
            console.log("we're still goin", post);
            console.log('category', category);
            category.posts.push(post._id);
            category.lastPost = {date: post.date, name: user.username, title: post.title, id: post._id};
            category.save(function(err, category){
                cb(null, post, user)
            });
        });
    }
});

router.post('/addReply', function(req,res){

    var decodedToken = jwtDecode(req.body.token);

    var newReply = new ForumReply({
        user: decodedToken.user._id,
        post: req.body.postId,
        content: req.body.content,
        quote: req.body.quote
    });

    async.waterfall([
       saveNewReplyAndPopulateUser,
       addNewReplyToPost
    ], function(err, reply){
        if (err) {
            res.status(500).json({
                message: 'An error has ocured',
                obj: err
            })
        }
        console.log('final reply', reply);
        res.status(200).json({
            message: "you have successfully added a new reply",
            obj: reply
        })
    });

    function saveNewReplyAndPopulateUser(cb){
        newReply.save(function(err, reply){
            reply.populate('user', 'username profilePicture', function(err, reply){
                cb(null, reply)
            });
        });
    }

    function addNewReplyToPost(reply, cb) {
        ForumPost.findOne({'_id': req.body.postId}, function(err, post){
            post.replies.push(reply._id);
            post.save(function(err, post){
                cb(null, reply);
            });
        });
    }
});

router.post('/createForumSection', (req, res) => {

  const newSection = new ForumSection({
    name: req.body.name,
    description: req.body.description
  });

  newSection.save((err, section) => {

    if (err) {
      console.log('possible error', err)
      return res.status(500).json({
        msg: "An Error occured",
        err: err
      })
    }

    res.status(200).json({
      msg: "successfully created a section",
      obj: section
    })
  })
});

router.delete('/deletePost/:postId', function(req, res) {
  const postId = req.params.postId;

  async.waterfall([
    findPostRepliesAndRemoveThem,
    deletePost
  ], function(err) {
if (err) {
  res.status(500).json({
    msg: "An Error occured",
    error: err
  })
}
res.status(200).json({
  msg: "successfully deleted post",
  obj: postId
})

  });

  function findPostRepliesAndRemoveThem(cb) {
    ForumReply.find({'post': postId})
      .remove(function(err, result) {
        console.log('result after remove command', result)
        cb(null)
      })
  }

  function deletePost(cb) {
    ForumPost.findOne({'_id': postId})
      .remove(function(err, result) {
        console.log('result of deleting post', result);
        cb(null)
    })
  }
})


router.delete('/deleteReply/:replyId/:postId/:userId', function(req, res) {

    var replyId = req.params.replyId;
    var postId = req.params.postId;
    var userId = req.params.userId;

    async.parallel([
        deleteFromForumReplies,
        deleteFromForumPosts,
        deleteFromUser
    ], function(err, result){
        if (err) {
            res.status(500).json({
                message: 'An error has occured',
                obj: err
            })
        }
        console.log('result', result);
        res.status(200).json({
            message: "you have successfully added a new reply",
            obj: result
        })
    });

    function deleteFromForumReplies(cb) {
        ForumReply.findOneAndRemove({'_id': replyId}, function (err, removedObj){
            console.log('removed Obj', removedObj);
            cb(null, removedObj)
    });
    }

    function deleteFromForumPosts(cb) {
        ForumPost.findOne({'_id': postId}, function(err, post){
            const index = post.replies.findIndex(reply => reply._id === replyId)
            post.replies.splice(index, 1);
            post.save(function(err, post){
                cb(null, post)
            })
        })
    }

    function deleteFromUser(cb){
        User.findOne({'_id': userId}, function(err, user){
            const index = user.forumReplies.indexOf(replyId);
            user.forumReplies.splice(index, 1);
            user.save(function(err, user){
                cb(null, user)
            })
        })
    }
});

router.post('/editReply', function(req, res){
   async.waterfall([
       findReply,
       saveReply
   ], function(err, reply){
       if (err) {
           res.status(500).json({
               message: 'An error has occured',
               obj: err
           })
       }
       console.log('reply', reply);
       res.status(200).json({
           message: "you have successfully edited your reply",
           obj: reply
       })
   });

   function findReply(cb){
       ForumReply.findOne({'_id': req.body.replyId}, function(err, reply){
        cb(null, reply)
       });
   }

   function saveReply(reply, cb) {
       reply.content = req.body.newReplyContent;

     reply.save(function (err, reply) {
           cb(null, reply)
       })
   }
});

router.post('/forumCountMin', function(req, res) {
   console.log('entered back-end');

    var loggedIn =  req.body.isLoggedIn;
    ForumCount.find({}, function(err, countDocs) {

        loggedIn ? countDocs[0].registered-- : countDocs[0].guests--;

        countDocs[0].save(function (err, doc) {
            if (err) {
                return res.status(500).json({
                    message: "unable to find this specific post",
                    err: err
                })
            }
            res.status(200).json({
                msg: "hellooooo"
            });
        });
    });
});

router.post('/forumCountPlus', function (req,res) {
    var loggedIn = req.body.isLoggedIn;

    ForumCount.find({}, function(err, countDocs) {

        loggedIn ? countDocs[0].registered++ : countDocs[0].guests++;
        var countTotal = countDocs[0].registered + countDocs[0].guests;

        // if there is a new total amount of users, then update the db document.
        if ( countTotal > countDocs[0].highestNumber.num) {
            countDocs[0].highestNumber.num = countTotal;
            countDocs[0].highestNumber.date = new Date();
        }
        countDocs[0].save(function (err, doc) {
            if (err) {
                return res.status(500).json({
                    message: "unable to find this specific post",
                    err: err
                })
            }

            res.status(200).json({
                registered: doc.registered,
                guests: doc.guests,
                highestNumber: {
                    num: doc.highestNumber.num,
                    date: doc.highestNumber.date
                }
            });
        });
    })
});

router.get('/getAllPosts', (req, res) => {
  console.log('reached all posts');

  ForumPost.find({})
    .populate([{
      path: 'user',
      select: 'username replies profilePicture'
    }, {
      path: 'replies',
      select: 'user date',
      populate: {
        path: 'user',
        select: 'username'
      }
    }])
    .exec( (err, posts) => {
      if (err) {
        res.status(500).json({
          msg: 'An error occured',
          err: err
        })
      }

      console.log("found the posts", posts);
      res.status(200).json({
        msg: 'successfully retrieved the posts',
        obj: posts
      })
  })
})

router.get('/getForumSectionsHomepage', function(req, res){
    console.log('entered getForum...');
    ForumSection.find({})
        .populate({
            path: 'posts',
            select: 'user title date',
            populate: {
                path: 'user',
                select: 'firstName lastName'
            }
        })
        .exec(function(err, sections){
            if (err) {
                return res.status(500).json({
                    message: "Something went wrong",
                    err: err
                });
            }
            res.status(200).json({
                message: "Successfully retrieved the section",
                obj: sections
            });
        })
});

router.get('/getLatestReplies/:userId', (req, res) => {
  ForumReply.find({'user': req.params.userId})
    .populate({
      path: 'post',
      select: 'title'
    })
    .sort('-date')
    .limit(3)
    .exec((err, replies) => {
      if (err) {
        return res.status(500).json({
          notification: "We couldn't receive the lastest replies of this user",
          err: err
        })
      }

      res.status(200).json({
        message: "Sucessfully received the latest replies",
        obj: replies
      })
    })
})

router.get('/getPost/:id', function(req, res){
    ForumPost.findOne({'_id': req.params.id})
        .populate('user', 'username forumPosts forumReplies registerDate date profilePicture')
        .populate({
            path: 'replies',
            populate: {
                path: 'user',
                select: 'username forumPosts profilePicture forumReplies registerDate date'
            }
        })
        .exec(function(err, post){
            if (err) {
                return res.status(500).json({
                    message: "unable to find this specific post",
                    err: err
                })
            }
            post.totalViews++;
            post.save(function(err, post){
                if (err) {
                    return res.status(500).json({
                        message: "unble to find this specific post",
                        err: err
                    })
                }
                res.status(200).json({
                    message: "successfully received post",
                    obj: post
                });
            });
        })
});

router.post('/getPosts', function(req, res) {
  if (req.body.country) {

    ForumSection.findOne({'name': req.body.country})
      .populate({
        path: 'posts',
        populate: [{
          path: 'user',
          select: 'username replies profilePicture'
        }, {
          path: 'replies',
          select: 'user date',
          populate: {
            path: 'user',
            select: 'username'
          }
        }]
      })
      .exec(function (err, section) {
        if (err) {
          return res.status(500).json({
            message: "something went wrong",
            err: err
          })
        }
        console.log('section result', section);
        if (!section) {




          console.log('there is no section');
          createNewCountrySection(req.body.country, (err, section) => {
            console.log('received callback')

            if (err) {
              res.status(500).json({
                msg: "something went wrong",
                err: err
              })
            }
            res.status(200).json({
              msg: "Sucessfully created new section",
              obj: section.posts,
              section: {name: section.name, description: section.description}
            })
          })
        } else {

          console.log('we received messages from a section that already existed')
          res.status(200).json({
            message: "successfully received messages",
            obj: section.posts,
            section: {name: section.name, description: section.description}
          })
        }

      });
  } else {
    ForumSection.findOne({'name': req.body.category})
      .populate({
        path: 'posts',
        populate: [{
          path: 'user',
          select: 'username replies profilePicture'
        }, {
          path: 'replies',
          select: 'user date',
          populate: {
            path: 'user',
            select: 'username'
          }
        }]
      })

      .exec( function(err, section) {
        if (err) {
          return res.status(500).json({
            message: "unable to find this specific section",
            err: err
          })
        }
        console.log('we reached this part somehow');
        console.log('test3 end', section);
        res.status(200).json({
          message: "successfully received messages",
          obj: section.posts,
          section: {name: section.name, description: section.description}
        })
      });
  }
});

function createNewCountrySection(country, cb) {
  const newSection = new ForumSection({
    description: `Welcome to the ${country} forum. Discuss the game with other people from your country`,
    name: country
  });

  newSection.save( (err, section) => {
    if (err) {
      cb(err)
    } else {
      cb(null, section);
    }
  })
}

router.get('/getReplies', function(req, res){

    ForumPost.findOne({'_id': req.body.postId})
        .populate({
            path: 'replies',
            populate: {
                path: 'user',
                select: 'username forumPosts profilePicture forumReplies registerDate date'
            }
        })
        .exec(function(err, post){
            if (err) {
                res.status(500).json({
                    message: "something wrong happened",
                    err: err
                })
            }
            res.status(200).json({
                message: "successfully retrieved the messages",
                obj: post
            })
        })
});

router.get('/getSections', function(req, res){
   ForumSection.find({})
       .exec(function(err, sections){
           if (err) {
               return res.status(500).json({
                   message: "Something went wrong",
                   err: err
               });
           }
           res.status(200).json({
               message: "Successfully retrieved the section",
               obj: sections
           });
       })
});

router.get('/getSubViews', function(req, res) {

    SubViewCount.find({'section': new RegExp('quests|cities|tips & tricks|general', 'gi')}, function(err, results){
        if (err) {
            return res.status(500).json({
                message: "Something went wrong",
                err: err
            });
        }

        res.status(200).json({
            views: results
        })
    })

});

router.get('/subViewPlus/:section/:sign', function(req, res){
    SubViewCount.findOne({'section': req.params.section}, function(err, doc){
        req.params.sign === 'plus' ? doc.views++ : doc.views--;
        doc.save(function(err, doc){
            if (err) {
                return res.status(500).json({
                    message: "Something went wrong",
                    err: err
                });
            }
            res.status(200).json({
                views: doc.views
            })
        })
    })
});


module.exports = router;
