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
import { FreedomWallComponent } from './pages/freedom-wall/freedom-wall.component';
import { MembersComponent } from './pages/members/members.component';
import { DisplayComponent } from './display/display.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ArchiveComponent } from './pages/archive/archive.component';

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataService } from '../service/data.service';
import { AnModalComponent } from './pages/dashboard/an-modal/an-modal.component';
import { AnEditModalComponent } from './pages/dashboard/an-edit-modal/an-edit-modal.component';
import { ProfileIconComponent } from './pages/dashboard/profile-icon/profile-icon.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EventsComponent,
    FreedomWallComponent,
    MembersComponent,
    DisplayComponent,
    SidebarComponent,
    ArchiveComponent,
    AnModalComponent,
    AnEditModalComponent,
    ProfileIconComponent,


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
    MatButtonModule,
    MatMenuModule,
  ],
  providers: [provideAnimationsAsync(), DataService,  DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
