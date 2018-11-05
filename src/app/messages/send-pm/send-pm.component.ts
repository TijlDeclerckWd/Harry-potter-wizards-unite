import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/auth.service";


@Component({
    selector: 'send-pm',
    templateUrl: 'send-pm.component.html',
    styleUrls: ['send-pm.component.css']
})

export class SendPmComponent implements OnInit, OnChanges {

    destinationUserId;
    sendPmForm: FormGroup;
    @Input('destinationUser') destinationUser;
    @Output('closeModal') closeModal = new EventEmitter();

    constructor(private authService: AuthenticationService) {}

    ngOnChanges() {
      if (this.destinationUser) {
        this.destinationUserId = this.destinationUser._id;
      }
    }

    ngOnInit() {
        this.sendPmForm = new FormGroup({
            message: new FormControl(null, [Validators.required])
        });
    }

    sendPM() {
        const destinationUserId = this.destinationUserId;
        console.log('test destinationUserId', destinationUserId);
        const currentUserId = this.authService.currentUser().user._id;

        this.authService.sendPM(this.sendPmForm.value.message, destinationUserId, currentUserId)
            .subscribe((data) => {
                console.log(data);
                this.sendPmForm.reset();
                this.closeModal.emit();
            });
    }
}
