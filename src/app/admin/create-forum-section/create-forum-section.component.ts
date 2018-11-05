import { Component, OnInit } from '@angular/core';
import {ForumService} from '../../services/forum.service';

@Component({
  selector: 'create-forum-section',
  templateUrl: './create-forum-section.component.html',
  styleUrls: ['./create-forum-section.component.css']
})
export class CreateForumSectionComponent implements OnInit {

  newSectionName = '';
  newSectionDescription = '';
  color = 'green';

  constructor(private forumService: ForumService) { }

  ngOnInit() {
  }

  createForumSection() {
    if (this.newSectionName && this.newSectionDescription) {
      const data = {
        name: this.newSectionName,
        description: this.newSectionDescription
      };
      this.forumService.createForumSection(data)
        .subscribe( result => {
          this.newSectionName = '';
          this.newSectionDescription = '';
        });
    }

  }

}
