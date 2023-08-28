import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.routes'),
      },
      {
        path: 'event-attendance',
        data: { pageTitle: 'EventAttendances' },
        loadChildren: () => import('./event-attendance/event-attendance.routes'),
      },
      {
        path: 'location',
        data: { pageTitle: 'Locations' },
        loadChildren: () => import('./location/location.routes'),
      },
      {
        path: 'rfb-user',
        data: { pageTitle: 'RfbUsers' },
        loadChildren: () => import('./rfb-user/rfb-user.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
