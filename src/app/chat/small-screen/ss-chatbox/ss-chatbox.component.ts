import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ss-chatbox',
  templateUrl: './ss-chatbox.component.html',
  styleUrls: ['./ss-chatbox.component.css']
})
export class SsChatboxComponent implements OnInit {

  @Input('displayedConversation') displayedConversation;
  @Output('closeDisplayedConv') closeDisplayedConv = new EventEmitter();
  @Output('minimizeDisplayedConv') minimizeDisplayedConv = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.displayedConversation);
  }
}
