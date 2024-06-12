import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FreedomWallComponent } 
  from './pages/freedom-wall/freedom-wall.component';
import { EventsComponent } from './pages/events/events.component';
import { MembersComponent } from './pages/members/members.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { VerifyComponent } from './login/verify/verify.component';

import { AuthGuard } from './login/auth.guard';
import { LoginGuard } from './login/login.guard'; // Import the LoginGuard

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: DashboardComponent, canActivate:[AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'freedom-wall', component: FreedomWallComponent, 
      canActivate:[AuthGuard]},
  { path: 'events', component: EventsComponent, canActivate:[AuthGuard] },
  { path: 'members', component: MembersComponent, canActivate:[AuthGuard] },
  { path: 'archive', component: ArchiveComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
