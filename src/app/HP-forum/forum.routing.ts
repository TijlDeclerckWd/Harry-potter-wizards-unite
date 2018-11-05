
import {Routes} from '@angular/router';
import {ForumListComponent} from './forum-list/forum-list.component';

export const FORUM_ROUTES: Routes = [
  { path: '', component: ForumListComponent},
  { path: 'discussions/:category/:country', component: ForumListComponent},
  { path: 'discussions/:category', component: ForumListComponent}
];
