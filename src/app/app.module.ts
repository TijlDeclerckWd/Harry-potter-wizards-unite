import { BrowserModule } from "@angular/platform-browser";

import {ErrorHandler, NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule, MatProgressSpinnerModule, MatSnackBarModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule,
  MatSlideToggleModule, MatChipsModule, MatBadgeModule, MatMenuModule, MatIconModule, MatDialogModule, MatDividerModule, MatPaginatorModule
} from '@angular/material';

import {MatDatepickerModule} from '@angular/material/datepicker';

import { AppComponent } from "./app.component";
import {RECAPTCHA_LANGUAGE, RecaptchaModule} from 'ng-recaptcha';




import {AgePipe, FindLocalsComponent} from './find-locals/find-locals.component';

import { HomeComponent } from "./home/home.component";

import { LocalPlayersHomeComponent } from "./home/local-players-homepage/local-players-home.component";
import { LoginComponent } from "./auth/login/login.component";
import { LogoutComponent } from "./auth/logout.component";
import { MessagesComponent, ShortenMessagePipe } from "./messages/messages.component";
import { NavigationComponent } from "./header.1/navigation/navigation.component";

import { ProfileNavComponent } from "./profile/profile-nav/profile-nav.component";
import { SendPmComponent } from "./messages/send-pm/send-pm.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { UserNavigationComponent } from './header.1/user-navigation/user-navigation.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxEditorModule} from 'ngx-editor';
import { routing } from './app.routing';
import {MomentModule} from 'ngx-moment';
import { AuthenticationService } from "./services/auth.service";
import { AuthGuard } from "./services/auth-guard.service";
import { ChatroomService } from "./services/chatroom.service";

import { FindLocalsService } from "./services/find-locals.service";
import { ForumService } from "./services/forum.service";
import { MessagesService } from "./services/messages.service";
import { NavigationService } from "./services/navigation.service";
import { RoleGuardService } from "./services/role-guard.service";
import { UserService } from "./services/user.service";
import { AgmCoreModule } from '@agm/core';
import { ProfileMainComponent } from './profile/profile-main/profile-main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorsHandler} from './errors/errors-handler';
import {NotificationService} from './services/notification.service';
import {ServerErrorsInterceptor} from './errors/server-errors.interceptor';
import { ErrorComponent } from './errors/error/error.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LocalPlayersOfflineComponent } from './home/local-players-offline/local-players-offline.component';
import { ForumHomepageComponent } from './home/forum-homepage/forum-homepage.component';
import { ChatComponent } from './chat/chat.component';
import { TestComponent } from './test/test.component';
import { ForumHeaderComponent } from './HP-forum/forum-header/forum-header.component';
import { ForumNavigationComponent } from './HP-forum/forum-navigation/forum-navigation.component';
import { ForumListComponent } from './HP-forum/forum-list/forum-list.component';
import {ForumMainComponent} from './HP-forum/forum-main/forum-main.component';
import {ForumPostComponent} from './HP-forum/forum-post/forum-post.component';
import { ForumReplyComponent } from './HP-forum/forum-reply/forum-reply.component';
import { AdminComponent } from './admin/admin/admin.component';
import { AdminNavigationComponent } from './admin/admin-navigation/admin-navigation.component';
import { CreateForumSectionComponent } from './admin/create-forum-section/create-forum-section.component';
import { CreatePostDialogComponent } from './HP-forum/create-post-dialog/create-post-dialog.component';
import {LocationGuardService} from './services/location-guard.service';
import { SsChatboxComponent } from './chat/small-screen/ss-chatbox/ss-chatbox.component';
import { ChatboxWindowComponent } from './chat/chatbox-window/chatbox-window.component';
import { AdminErrorsComponent } from './admin/admin-errors/admin-errors.component';
import {MsToDatePipe} from './pipes/msToDate.pipe';
import {RecaptchaDirective} from './directives/recaptcha.directive';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { LastForumPostsComponent } from './profile/profile-main/last-forum-posts/last-forum-posts.component';
import { LastForumRepliesComponent } from './profile/profile-main/last-forum-replies/last-forum-replies.component';
import {CutTooLongSentencesPipe} from './pipes/cut-too-long-sentences.pipe';



@NgModule({
  declarations: [
    AppComponent,
    AgePipe,
    CutTooLongSentencesPipe,

        FindLocalsComponent,
        ForumMainComponent,
        ForumPostComponent,
        HomeComponent,
        LocalPlayersHomeComponent,
        LoginComponent,
        LogoutComponent,
        MessagesComponent,
        NavigationComponent,
        ProfileNavComponent,
        SendPmComponent,
        ShortenMessagePipe,
        SignUpComponent,
        UserNavigationComponent,
        ProfileMainComponent,
        ErrorComponent,
        NotificationsComponent,
        LocalPlayersOfflineComponent,
        ForumHomepageComponent,
        ChatComponent,
        ForumHeaderComponent,
        ForumNavigationComponent,
        ForumListComponent,
        ForumReplyComponent,
        AdminComponent,
        AdminNavigationComponent,
        CreateForumSectionComponent,
        CreatePostDialogComponent,
        SsChatboxComponent,
        ChatboxWindowComponent,
    TestComponent,
    AdminErrorsComponent,
    MsToDatePipe,
    RecaptchaDirective,
    LastForumPostsComponent,
    LastForumRepliesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDFDGOMDXkdSHOkVaVbGjIwtMvqaTwVXCA'
    }),
    NgbModule.forRoot(),
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    MomentModule,
    NgxEditorModule,
    HttpClientModule,
    routing,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule

  ],
  providers: [AuthenticationService,
    AuthGuard,
    ChatroomService,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    HttpClientModule,
    FindLocalsService,
    ForumService,
    MessagesService,
    NavigationService,
    NotificationService,
    LocationGuardService,
    RoleGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
    UserService,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'en', // use English language
    }],
  bootstrap: [AppComponent],
  entryComponents: [CreatePostDialogComponent]
})
export class AppModule {}

