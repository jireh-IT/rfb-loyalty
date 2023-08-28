import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventAttendanceComponent } from './list/event-attendance.component';
import { EventAttendanceDetailComponent } from './detail/event-attendance-detail.component';
import { EventAttendanceUpdateComponent } from './update/event-attendance-update.component';
import EventAttendanceResolve from './route/event-attendance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const eventAttendanceRoute: Routes = [
  {
    path: '',
    component: EventAttendanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventAttendanceDetailComponent,
    resolve: {
      eventAttendance: EventAttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventAttendanceUpdateComponent,
    resolve: {
      eventAttendance: EventAttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventAttendanceUpdateComponent,
    resolve: {
      eventAttendance: EventAttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default eventAttendanceRoute;
