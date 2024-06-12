import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/homepage-events/homepage-events.component';
import { FreedomWallComponent } from './pages/freedom-wall/freedom-wall.component';
import { EventsComponent } from './pages/events/events.component';
import { MembersComponent } from './pages/members/members.component';
import { ArchiveComponent } from './pages/archive/archive.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'freedom-wall', component: FreedomWallComponent },
  { path: 'events', component: EventsComponent },
  { path: 'members', component: MembersComponent },
  { path: 'archive', component: ArchiveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
