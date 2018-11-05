import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ForumService} from '../../services/forum.service';

@Component({
  selector: 'forum-header',
  templateUrl: './forum-header.component.html',
  styleUrls: ['./forum-header.component.css']
})
export class ForumHeaderComponent implements OnInit, OnChanges {

  @Input('post') post;
  main = false;

  title: string;
  category: string;
  description: string;


  categories = [
    {name: 'Quests', description: 'Join others on a quest, ask for advice on one or start one yourself.'},
    {name: 'Cities', description: 'Discuss the game and strategy with people in your area. '},
    {name: 'Tips & tricks', description: 'Have a trick you would like to tell others about? Or learn from others to improve your game?'},
    {name: 'General', description: 'Join existing topics in one of our various categories or start a your own discussion'}
    ];


  constructor(private route: ActivatedRoute, private forumService: ForumService) { }

  ngOnChanges() {
    console.log('detectenchange');
    this.main = true;
    this.title = 'Welcome to the Harry Potter: Wizards unite fans forum.';
    this.description = 'Join existing topics in one of our various categories or start a your own discussion';
    if (this.post) {
      this.main = false;
      this.writeTitles(null, this.post);
    }
  }

  ngOnInit() {
    console.log('detectChange 2');

    this.forumService.categoryOfTitle.subscribe( (section: any) => {
      this.main = true;
      this.title = section.name.toUpperCase();

      this.writeTitles(section);
    });
  }

  writeTitles(section, post?) {
    if (this.main) {
      if (section.name !== 'General') {
        this.description = section.description;
      } else if ( section.name === 'General') {
        this.title = 'Welcome to the Harry Potter: Wizards unite fans forum.';
        this.description = 'Join existing topics in one of our various categories or start a your own discussion';
      }
    } else {
      this.title = post.title;
      this.description = '';
      this.category = post.category;
    }
  }



}
