import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EventsComponent } from './pages/events/events.component';
import { FreedomWallComponent } 
  from './pages/freedom-wall/freedom-wall.component';
import { MembersComponent } from './pages/members/members.component';
import { DisplayComponent } from './display/display.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { VerifyComponent } from './login/verify/verify.component';
import { AnModalComponent } 
  from './pages/dashboard/an-modal/an-modal.component';
import { AnEditModalComponent } 
  from './pages/dashboard/an-edit-modal/an-edit-modal.component';
import { ProfileIconComponent } 
  from './pages/dashboard/profile-icon/profile-icon.component';

import { DataService } from '../service/data.service';
import { LoginService } from '../service/login.service';
import { AnnouncementService } from '../service/announcement.service';

import { PostDialogComponent } 
  from './pages/freedom-wall/post-dialog/post-dialog.component';
import { provideAnimationsAsync } 
  from '@angular/platform-browser/animations/async';

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMasonryModule } from 'ngx-masonry';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './login/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EventsComponent,
    FreedomWallComponent,
    PostDialogComponent,
    MembersComponent,
    DisplayComponent,
    SidebarComponent,
    ArchiveComponent,
    AnModalComponent,
    AnEditModalComponent,
    ProfileIconComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMasonryModule,
    MatDialogModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    })
  ],
  providers: [
    AuthGuard,
    DataService, 
    LoginService,
    AnnouncementService,  
    provideAnimationsAsync(),  
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
