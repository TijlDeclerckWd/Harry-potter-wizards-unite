const jwtDecode = require('jwt-decode');
const async  = require('async');
const Conversation = require('./models/conversation');
const LoggedInUser = require('./models/loggedInUser');

// define constructor function that gets `io` send to it
module.exports = function(io) {

  io.on('connection', function(socket) {
    const token = socket.handshake.query.token;

    const decodedToken = jwtDecode(token);

    addToLoggedInUsers(decodedToken.user._id);

    console.log('user connected');

    let messagesCount = 0;
    let currentMessagesCount = 0;
    let amountOfOnlineUsers = null;

    // Find any conversation the user is part of
    Conversation.find({$or: [{user1: decodedToken.user._id}, {user2: decodedToken.user._id}]})
      .populate('messages.from', 'username profilePicture')
      .populate('messages.to', 'username profilePicture')
      .exec((err, conversations) => {
        if (err) {
          socket.emit('error-thrown', {
            notification: 'an error occurred when we tried to get the conversations. Please try again later',
            err: err
          })
        }
        else {
          socket.emit('conversations', conversations);
          // after we send the conversations to the client we set the start counts for conversations and messages

          // here we set the original messagescount
          messagesCount = conversations.reduce((sum, curr) => sum + curr.messages.length, 0);

          lookForNewMessages();
          startInterval();
        }
      });

    let updateInterval;

    function startInterval() {
      updateInterval = setInterval( () =>  {
        lookForNewMessages();
        getLoggedInUsers();
        },
        5000
      );
    }

    function lookForNewMessages() {
      Conversation.find({$or: [{user1: decodedToken.user._id}, {user2: decodedToken.user._id}]})
        .populate('messages.from', 'username profilePicture')
        .populate('messages.to', 'username profilePicture')
        .exec((err, conversations) => {
          if (err) {
            socket.emit('error', {
              notification: 'an error occurred when we tried to get the conversations. Please try again later',
              err: err
            });
          }

          currentMessagesCount = conversations.reduce((sum, curr) => sum + curr.messages.length, 0);

          // if there are more messages now than there were at the last count
          if (currentMessagesCount > messagesCount) {
            // we reset the counters before the next interval cycle;
            messagesCount = currentMessagesCount;
            currentMessagesCount = 0;

            // we go through every conversation and update the lastMsgCount and NewMessages properties
            //  before sending the updated conversations to the client
            conversations.forEach((conversation) => {
              //if there are more msgs in this conversation than at the last count
              if (conversation.lastMsgCount < conversation.messages.length) {
                let numberOfNewMessages = conversation.messages.length - conversation.lastMsgCount;
                // new messages can only be from one side so if there are new messages in a (private) conversation, they come from one sender
                let destinationUserId = conversation.messages[conversation.messages.length-1].to._id;

                conversation.newMessages = {
                  receiver: destinationUserId,
                  count: numberOfNewMessages
                };
                conversation.save();
              }
            });
            // After all the conversations have been updated we send them back to the client so it can update the list

            socket.emit('conversations', conversations);
          }
        });
    }

    socket.on('join', function(params) {

      let decodedToken = jwtDecode(params.token);
      let biggerOne = params.user1 > params.user2 ? params.user1 : params.user2;
      let smallerOne = params.user1 < params.user2 ? params.user1 : params.user2;
      let roomName = biggerOne + smallerOne;

      socket.join(roomName);

      Conversation.findOne({$and: [{user1: biggerOne}, {user2: smallerOne}]})
        .populate('messages.from', 'username')
        .populate('messages.to', 'username')
        .exec(function (err, conversation) {
          if (err) {
            socket.emit('error-thrown', {
              notification: "We were unable to open the conversation. Please try again later",
              err: err
            })
          }
          socket.emit('message', {
            target: "openConversation",
            conversation: conversation
          });

          //If the person opening the chatbox is the same as the one who hadn't seen the new messages
          if (decodedToken.user._id == conversation.newMessages.receiver) {
            // We indicate that the user has seen the messages
            conversation.newMessages = {receiver: null, count: 0};
            // we update the lastMsgCount so the setInterval can start detecting new messages
            conversation.lastMsgCount = conversation.messages.length;
            conversation.save();
          }
        });
    });

    socket.on('leave', (params) => {
      const biggerOne = params.user1 > params.user2 ? params.user1 : params.user2;
      const smallerOne = biggerOne === params.user1 ? params.user2 : params.user1;
      const room = biggerOne + smallerOne;
      socket.leave(room);

      Conversation.findOne({$and: [{user1: biggerOne}, {user2: smallerOne}]})
        .exec(function (err, conversation) {

          conversation.newMessages = {receiver: null, count: 0};
          conversation.lastMsgCount = conversation.messages.length;
          conversation.save()
        });
    });

    socket.on('leaveAllRooms', (openConversations) => {
      const rooms = io.sockets.adapter.sids[socket.id];

      for(let room in rooms) {
        socket.leave(room);
      }

      openConversations.forEach( conversation => {
        const biggerOne = conversation.user1 > conversation.user2 ? conversation.user1 : conversation.user2;
        const smallerOne = conversation.user1 < conversation.user2 ? conversation.user1 : conversation.user2;

        Conversation.findOne({$and: [{user1: biggerOne}, {user2: smallerOne}]})
          .exec(function (err, conversation) {
            if (err) {
              socket.emit('error-thrown', {
                notification: "We were unable to open the conversation. Please try again later",
                err: err
              })
            }
            conversation.newMessages = {receiver: null, count: 0};
            conversation.lastMsgCount = conversation.messages.length;
            conversation.save()
          });
      })


    });


    socket.on('disconnect', function () {
      removeFromLoggedInUsers(decodedToken.user._id);
    });

    socket.on('reset-new-messages-conversation', function (conversationId) {
      resetNewMessages(conversationId);
    });

    function resetNewMessages(conversationId) {
      Conversation.findOne({'_id': conversationId})
        .exec((err, conversation) => {
          if (err) {
            socket.emit('error-thrown', {
              err: err
            })
          }
          conversation.newMessages = {count: 0, receiver: null};
          conversation.lastMsgCount = conversation.messages.length;
          conversation.save();
        })
    }

    socket.on('send-message', function (msg) {
      // Io.emit emits to every single connection, socket to everyone but you
      // var user = users.getUser(socket.id);
      let decodedToken = jwtDecode(msg.token);
      let biggerOne = decodedToken.user._id > msg.destinationUser ? decodedToken.user._id : msg.destinationUser;
      let smallerOne = decodedToken.user._id < msg.destinationUser ? decodedToken.user._id : msg.destinationUser;
      let username = decodedToken.user.username;
      let roomName = biggerOne + smallerOne;

      async.waterfall([
        findConversation,
        addMessageToConversation
      ], (err, newMessage) => {
        if (err) {
          // io.to(roomName.emit('message', {
          //   message: err,
          //   username: username,
          //   time: new Date().getTime()
          // }))

            socket.emit('error-thrown', {
              notification: "Something went wrong. Please try again later",
              err: err
            });

        } else {
          newMessage.target = "addNewMessage";
          newMessage.conversationId = msg.conversationId;
          io.to(roomName).emit('message', newMessage);
        }
      });

      function findConversation(cb){
        Conversation.find({
          $and: [{user1: biggerOne}, {user2: smallerOne}]}, (err, conversation) => {
          cb(null, conversation)
        })
      }

      function addMessageToConversation(conversation, cb) {
        let newMessage = {
          date: new Date(),
          from: { _id: decodedToken.user._id, username: username },
          to: { _id: msg.destinationUser },
          msg: msg.message
        };

        if (!conversation[0]){
          // stop the interval from running

          clearInterval(updateInterval);

          //    create new conversation
          let newConversation = new Conversation({
            user1: biggerOne,
            user2: smallerOne,
            messages: [newMessage]
          });
          //    save new conversation
          newConversation.save( (err, savedNewConversation) => {
            Conversation.find({$or: [{user1: decodedToken.user._id}, {user2: decodedToken.user._id}]})
              .populate('messages.from', 'username profilePicture')
              .populate('messages.to', 'username profilePicture')
              .exec((err, conversations) => {
                if (err) {
                }
                else {
                  socket.emit('conversations', conversations);
                  startInterval();
                  cb(null, newMessage);
                }
              });
          })
        } else {
          //    there is already a conversation and we need to add the new message to it
          conversation[0].messages.push(newMessage);
          conversation[0].save( (err, savedExistingConversation) => {
            cb(null, newMessage)
          })
        }
      }
    });

    function addToLoggedInUsers(user) {
      const newUser = new LoggedInUser({
        user
      });
      newUser.save( (err) => {
        if (err) {
          socket.emit('error-thrown', {
            notification: "We were unable to open the conversation. Please try again later",
            err: err
          })
        }
      });
    }

    function removeFromLoggedInUsers(user) {
      LoggedInUser.findOne({'user': user})
        .remove()
        .exec( (err) => {
          if (err) {
            socket.emit('error-thrown', {
              notification: "We were unable to open the conversation. Please try again later",
              err: err
            })
          }
        })
    }

    function getLoggedInUsers() {
      LoggedInUser.find({})
        .exec((err, users) => {
          if (err) {
            socket.emit('error-thrown', {
              notification: "An Error occured. Please try again later",
              err: err
            })
          }
          console.log('received the online users list', users);
          if (amountOfOnlineUsers === null || amountOfOnlineUsers !== users.length) {
            amountOfOnlineUsers = users.length;
            const userList = users.map(loggedInUser => loggedInUser.user);
            console.log('userlist', userList);
            socket.emit('updateOnlineUser', userList)
          }
        })
    }
  });
};
