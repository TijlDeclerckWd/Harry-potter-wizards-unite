import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'chatbox-window',
  templateUrl: './chatbox-window.component.html',
  styleUrls: ['./chatbox-window.component.css']
})
export class ChatboxWindowComponent implements OnChanges, OnInit, AfterViewInit {

  @Input('conversation') conversation;
  @ViewChild('window') window;
  @ViewChildren("messageContainer") messageContainers: QueryList<ElementRef>;

  constructor() { }

  ngOnChanges() {
    // If the date separators have already been added once, we avoid doing it a second time
    const existingDateObj = this.conversation.messages.findIndex((item, i) => item.dateObj);

    if (existingDateObj === -1) {
      this.conversation.messages.forEach( (item, index, array) => {
        if (index !== 0) {
          const date1 = new Date(array[index - 1].date);
          const date2 = new Date(item.date);

          if (date2.getDate() !== date1.getDate() || date2.getMonth() !== date1.getMonth()) {
            this.conversation.messages.splice(index, 0, {date: date2, dateObj: true});
            console.log(this.conversation.messages.length);
          }
        }
      });
    }

    // setTimeout(() => { this.scrollToBottom(); }, 500);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.scrollToBottom(); // For messsages already present
    this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottom(); // For messages added later
    });
  }

  isItMyMsg(msg) {
    return msg.from._id === this.conversation.otherUser.userId;
  }

  scrollToBottom() {
    try {this.window.nativeElement.scrollTop = this.window.nativeElement.scrollHeight;
    } catch (err) {}
  }


}
