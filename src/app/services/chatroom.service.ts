import {Injectable} from "@angular/core";
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import {HttpClient} from "@angular/common/http";
import {interval} from "rxjs";
import {Subject} from "rxjs";
import {url} from "../reusable code/reusable-code";
import {AuthenticationService} from './auth.service';
import {NotificationService} from './notification.service';

@Injectable()

export class ChatroomService {

    private url = url;
    private socket;
    getUserPMs = new Subject();
    getOnlineUsers = new Subject();

    seenMessagesCount = [];

    constructor(private http: HttpClient, private authService: AuthenticationService, private notificationService: NotificationService) {}

    getMessages(token) {
        let observable = new Observable(observer => {
            let query  = {query: 'token=' + token};
            this.socket = io(this.url, query);
            this.socket.on('message', (message) => {
              if (message.target === "openConversation") {
                if (message.conversation.messages[0].from._id == this.authService.currentUser().user._id) {
                  message.conversation.otherUser = {
                    _id: message.conversation.messages[0].to._id,
                    username: message.conversation.messages[0].to.username,
                    userId: message.conversation.messages[0].to._id,
                    profilePicture: message.conversation.messages[0].to.profilePicture
                  };
                } else {
                  message.conversation.otherUser = {
                    _id: message.conversation.messages[0].from._id,
                    username: message.conversation.messages[0].from.username,
                    userId: message.conversation.messages[0].from._id,
                    profilePicture: message.conversation.messages[0].from.profilePicture
                  };
                }
              }
              observer.next(message);
            });

            this.socket.on('updateOnlineUser', (users) => {
                this.getOnlineUsers.next(users);
            });

            this.socket.on('conversations', (conversations) => {
              conversations.map((conversation) => {
                if (conversation.messages[0].from._id == this.authService.currentUser().user._id) {
                  conversation.otherUser = {
                    _id: conversation.messages[0].to._id,
                    username: conversation.messages[0].to.username,
                    userId: conversation.messages[0].to._id,
                    profilePicture: conversation.messages[0].to.profilePicture
                  };
                } else {
                  conversation.otherUser = {
                    _id: conversation.messages[0].from._id,
                    username: conversation.messages[0].from.username,
                    userId: conversation.messages[0].from._id,
                    profilePicture: conversation.messages[0].from.profilePicture
                  };
                }
              });
              this.getUserPMs.next(conversations);
            });

            this.socket.on('error-thrown', (err) => {
              console.log('display error chat', err);
              this.notificationService.notify(err);
            });

            this.socket.on('connect_error', (err) => {
              err.notification = "We were unable to connect to the chat service. Please try again later";
              this.notificationService.notify(err);
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    countTotalNewMessages(conversations, openConversations) {
      const total = conversations.reduce( (sum, curr) => {
        if (curr.newMessages.count > 0 && curr.newMessages.receiver === this.authService.currentUser().user._id) {
          // If you find the current conversation between the open conversations, then we don't add it to the totalCount
          const index = openConversations.findIndex((openConv, i) => {
            return openConv._id === curr._id;
          });
          console.log('index', index);
          return index > -1 ? sum : sum + curr.newMessages.count;
        } else {
          return sum;
        }
      }, 0);
      return total;
    }

    determineBoxStyle(element, conversationId, minimizedConversations) {
      if (minimizedConversations.indexOf(conversationId) > -1) {
        if (element === 'chatbox') {
          return 4;
        } else if (element === 'input') {
          return 'none';
        }  else if (element === 'status') {
          return 'min';
        }  else if (element === 'header') {
          return 100;
        }  else if (element === 'window') {
          return 'none';
        }
      } else {
        if (element === 'chatbox') {
          return 30;
        } else if (element === 'input') {
          return 'block';
        }  else if (element === 'status') {
          return 'max';
        }  else if (element === 'header') {
          return 10;
        }  else if (element === 'window') {
          return 'block';
        }
      }
    }
    joinRoom(params) {
        return this.socket.emit('join', params);
    }

    leaveAllRooms(openConversations) {
      return this.socket.emit('leaveAllRooms', openConversations);
    }

    leaveRoom(params) {
      return this.socket.emit('leave', params);
    }

    resetAllNewMessages(closedConvList) {
      let total = [];
      closedConvList.forEach( closedConv => {
        const count = this.resetNewMessages(closedConv);
        total.push(count);
      });
      return total;
    }

    resetNewMessages(closedConv) {
      const index  = this.seenMessagesCount.findIndex( obj => obj._id === closedConv._id);
      console.log('entered service and', index);
      if (index > -1) {
        this.socket.emit('reset-new-messages-conversation', closedConv._id);
        return this.seenMessagesCount[index].count || 0;
      } else {
        return 0;
      }

    }

    sendMessage(msg) {
        return this.socket.emit('send-message', msg);
    }

    updateSeenMessages(conversationId, receiver) {
      console.log('conversationId', conversationId)
      //  if receiver is this current user
      if (receiver._id === this.authService.currentUser().user._id) {
        // and there is already an object in the array
        if (this.seenMessagesCount.length > 0) {
          const index = this.seenMessagesCount.findIndex((conv) => conv._id === conversationId);
          console.log('index', index);
          // if this conversation exists in the array we add 1 to the count key
          // otherwise we add our conversation
          index > -1 ? this.seenMessagesCount[index].count ++ : this.seenMessagesCount.push({_id: conversationId, receiver, count: 1});
        } else {
          this.seenMessagesCount.push({_id: conversationId, receiver, count: 1});
        }
      //  if receiver is not the currentUser
      } else {
        if (this.seenMessagesCount.length > 0) {
          const index = this.seenMessagesCount.findIndex((conv) => conv._id === conversationId);
          console.log('index', index);
          // then we delete the object and thus avoiding that these new messages are counted
          if (index) {
            this.seenMessagesCount.splice(index, 1);
          }
        }
      }


      console.log('the seenMessagesCount', this.seenMessagesCount);
    }

    startTimeCalculations = interval(60000);
}
