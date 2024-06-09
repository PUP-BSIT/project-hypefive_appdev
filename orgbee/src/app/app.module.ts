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


import { DataService } from '../service/data.service';
import { LoginService } from '../service/login.service';

import { PostDialogComponent } from './pages/freedom-wall/post-dialog/post-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMasonryModule } from 'ngx-masonry';
import { FormsModule } from '@angular/forms';


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
    ArchiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMasonryModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [DataService, LoginService,  provideAnimationsAsync()],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
