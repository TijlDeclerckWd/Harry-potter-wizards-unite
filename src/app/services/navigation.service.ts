import {Injectable, OnInit} from "@angular/core";
import {Subject} from 'rxjs';

@Injectable()

export class NavigationService {

    checkboxUpdates = new Subject();

    constructor() {}

}
