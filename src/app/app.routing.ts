import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./auth/login/login.component";
import {LogoutComponent} from "./auth/logout.component";
import {FindLocalsComponent} from "./find-locals/find-locals.component";
import {MessagesComponent} from "./messages/messages.component";
import {RoleGuardService} from "./services/role-guard.service";
import {AuthGuard} from "./services/auth-guard.service";

import {ProfileMainComponent} from './profile/profile-main/profile-main.component';
import {ErrorComponent} from './errors/error/error.component';
import {ForumMainComponent} from './HP-forum/forum-main/forum-main.component';
import {FORUM_ROUTES} from './HP-forum/forum.routing';
import {ForumPostComponent} from './HP-forum/forum-post/forum-post.component';
import {AdminComponent} from './admin/admin/admin.component';
import {LocationGuardService} from './services/location-guard.service';


const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'forum/p/:postId',
    component: ForumPostComponent
  },
    {
        path: 'forum',
        component: ForumMainComponent,
        children: FORUM_ROUTES
    },
    {
        path: 'locateLocals',
      canActivate: [LocationGuardService],
        component: FindLocalsComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'messages/:id',
        component: MessagesComponent
    },
  {
    path: 'profile/:id',
    component: ProfileMainComponent
  },
  {
    path: 'errors',
    component: ErrorComponent
  },
  {
    path: '**',
    component: ErrorComponent,
    data: { error: 404 }
  }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
