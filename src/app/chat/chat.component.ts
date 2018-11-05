import {AfterViewChecked, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {AuthenticationService} from '../services/auth.service';
import {ShortenMessagePipe} from '../messages/messages.component';
import {Conversation} from './conversation.model';
import {ChatroomService} from '../services/chatroom.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  conversations: Array<Conversation> = [];
  checkboxChecked = false;
  openConversations: Array<Conversation> = [];
  ngUnsubscribe = new Subject();
  msg = '';
  totalNewMessages = 0;
  windowWidth;
  displayedConversation;
  onlineUsers = [];
  minimizedConversations = [];

  @ViewChild('chatWindow') chatWindow;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth > 900) {
      this.displayedConversation = null;
    }
  }


  constructor(
              private authService: AuthenticationService,
              private chatroomService: ChatroomService) {
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    // We will only connect to the socket if the user is logged in;
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');

      this.chatroomService.getOnlineUsers
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((userList: string[]) => {
          this.onlineUsers = userList;
          console.log('received userList', userList);
        });

      // Subject in service that receives all the conversations of the user.
      this.chatroomService.getUserPMs
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((PMs: Conversation[]) => {
          console.log('received updated conversations');
          this.conversations = PMs;
          this.totalNewMessages = this.chatroomService.countTotalNewMessages(PMs, this.openConversations);
          console.log('totalNewMessages', this.totalNewMessages);
        });

      // getMessages receives two types of things:
      this.chatroomService.getMessages(token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((message: any) => {
          // A conversation that we received from the socket that we would like to display. We wanted to get the most recent up-to-date version of this conversation so we handled
          // it through the openConversation method. We load the conversation through the socket when we click a conversation list item.
          // This way we include the messages that were send when the chat window wasn't open.
          if (message.target === 'openConversation') {
            // after getting an update of the messages on the server we open this conversation on the screen
            this.openConversations.push(message.conversation);
            if (this.windowWidth < 900) {
              this.displayedConversation = message.conversation;
            }
          }
          // When the target is addNewMessage we add a message to one of the opened conversations in this.openConversations
          //  this is a result of the sendMessage method in this component and this message was also saved to the database before we sent it back to the client
          else if (message.target === 'addNewMessage') {

            this.chatroomService.updateSeenMessages(message.conversationId, message.to);
            // We add the message to the belonging opened conversation. If the conversation is not opened (selectedCOnversation is false).
            // The new message will be loaded when the client opens this conversation.
            const selectedConversation = this.openConversations.find((openConversation) => {
              // When Id of the conversation of the new message equals the one of the open conversation's ID's we add the message to it
              return openConversation._id === message.conversationId;
            });

            if (selectedConversation) {
              selectedConversation.messages.push(message);
              // this.scrollToBottom();
            }
          }
          // the server checks every 30 seconds for new conversations and if there are new ones
          //  it sends them back here so we can add them to our list of conversations
          //  we add the number of new conversations to the badge which will be shown when the chat
          //  checkbox is unchecked => CSS
          else if (message.target === 'addNewConversations') {
            this.conversations.push(message.newConversations);
          }
        });
    }
  }

  boxStyle(element, conversationId) {
    return this.chatroomService.determineBoxStyle(element, conversationId, this.minimizedConversations);
  }

  displayUnseenMessages(conversation) {
    // There are two conditions for displaying the newMessages label

    // First we need the receiver of these new messagesin the conversation to be the current user
    let test1;
      if (conversation.newMessages) {

        test1 = conversation.newMessages.receiver === this.authService.currentUser().user._id;
      } else {
        test1 = false;
      }

    //  second, if the conversation of the label is opened, we do not display the label
    let test2;
    if (this.openConversations) {
      test2 = !this.openConversations.find( (openConversation) =>  {
        return openConversation._id === conversation._id;
      });
    } else {
      test2 = true;
    }

    return test1 && test2;
  }

  // To open or close the chat
  changeCheckboxStatus() {
    this.checkboxChecked = !this.checkboxChecked;
    this.openConversations = [];
    this.displayedConversation = null;
  }

  closeBox(openConv: Conversation) {
    const index = this.openConversations.indexOf(openConv);
    if (index > -1) {
      const count = this.chatroomService.resetNewMessages(openConv);

      this.resetNewMessages(openConv, count);
      this.openConversations.splice(index, 1);
      const params = {user1: openConv.user1, user2: openConv.user2};
      this.chatroomService.leaveRoom(params);
    }
  }

  closeChat() {
    if (this.openConversations.length > 0) {

      this.chatroomService.leaveAllRooms(this.openConversations);
      const count = this.chatroomService.resetAllNewMessages(this.openConversations);
      this.openConversations.forEach((openConv, i) => {
        this.resetNewMessages(openConv, count[i]);
      });
        this.openConversations = [];
      this.displayedConversation = null;
    }
  }

  closeDisplayedConv(displayedConversation) {
    this.closeBox(this.displayedConversation);
    this.displayedConversation = null;
  }

  displayChatTopSS() {
    return this.smallWindowAndOpenConversations() ? 'flex' : 'none';
  }

displayChatboxSS() {
    return this.smallWindowAndOpenConversations() && this.displayedConversation;
}

displayConversationSS(conv) {
    const index = this.openConversations.findIndex( conversation => conversation.otherUser.username === conv.otherUser.username);

    this.displayedConversation = this.openConversations[index];
}

  heightMainChat() {
    return this.smallWindowAndOpenConversations() ? 90 : 100;
  }

  isBoxMinimized(conversationId) {
    return this.minimizedConversations.indexOf(conversationId) > -1;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isUserOnline(userId, name) {
    return this.onlineUsers.indexOf(userId) > -1;
  }

  joinPrivateChatRoom(user1, user2) {
    const params = {
      user1: user1,
      user2: user2,
      token: localStorage.getItem('token')
    };
    this.chatroomService.joinRoom(params);
  }

  minimizeBox(action, conversationId) {
    // this.chatboxStyle = action === 'minimize' ? minimized : normal;
    if (action === 'minimize') {
      this.minimizedConversations.push(conversationId);
    } else {
      const index  = this.minimizedConversations.indexOf(conversationId);
      this.minimizedConversations.splice(index, 1);
    }
  }

  minimizeDisplayedConv(displayedConv) {
    this.displayedConversation = null;
  }

  openConversation(conversation: Conversation) {
    // We want to check whether this conversation is already opened
    const conversationAlreadyOpened = this.openConversations.find((openConversation) => openConversation._id === conversation._id);

    // We only continue opening the conversation if it hasn't been opened yet
    if (!conversationAlreadyOpened && this.openConversations.length < 4) {
      this.totalNewMessages -= conversation.newMessages.count;
      conversation.newMessages.count = 0;
      conversation.newMessages.receiver = null;
      this.joinPrivateChatRoom(conversation.user1.trim(), conversation.user2.trim());
    }
  }

  resetNewMessages(openConv, count) {
    let targetConversation = this.conversations.find( (conversation) => {
      return conversation._id === openConv._id;
    });
    targetConversation.newMessages = {count: 0, receiver: null};

    this.totalNewMessages -= count;

  }

  sendMessage(destinationUser, conversationId) {
    this.chatroomService.sendMessage({
      token: localStorage.getItem('token'),
      destinationUser: destinationUser,
      message: this.msg,
      conversationId: conversationId
    });
    this.msg = '';
  }

  smallWindowAndOpenConversations() {
    return this.openConversations.length > 0 && this.windowWidth < 900;
  }

  topMainChat() {
    return this.smallWindowAndOpenConversations() ? 10 : 0;
  }

  trackById(i, conversation) {
    return conversation._id;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
