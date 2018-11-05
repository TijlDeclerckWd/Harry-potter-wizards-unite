import {Component, OnInit, Pipe, PipeTransform} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../services/auth.service";
import {MessagesService} from "../services/messages.service";

@Pipe({
    name: 'shortenMessage'
})

export class ShortenMessagePipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        if (value === null) return 'Not assigned';
        if (value.length < 15) return value;
        return value.slice(0, 15) + '...'
    }
}

@Component({
    selector: 'app-messages',
    styleUrls: ['messages.component.css'],
    templateUrl: 'messages.component.html'
})

export class MessagesComponent implements OnInit {

    userId:string;
    conversations = [];
    selectedConversation;

    constructor(private route: ActivatedRoute, private messageService: MessagesService){
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.userId = params.id;

            this.messageService.getUserPMs(this.userId)
                .subscribe((data) => {
                    console.log(data.obj);
                    this.conversations = data.obj;
                })
        })
    }

    myOwnMessage(senderId) {
        return senderId === this.userId
    }

    openNewConversation(conversation){
        this.selectedConversation = null;
        this.selectedConversation = conversation;
    }
}
