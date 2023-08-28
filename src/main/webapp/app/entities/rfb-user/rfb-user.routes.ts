import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RfbUserComponent } from './list/rfb-user.component';
import { RfbUserDetailComponent } from './detail/rfb-user-detail.component';
import { RfbUserUpdateComponent } from './update/rfb-user-update.component';
import RfbUserResolve from './route/rfb-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const rfbUserRoute: Routes = [
  {
    path: '',
    component: RfbUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RfbUserDetailComponent,
    resolve: {
      rfbUser: RfbUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RfbUserUpdateComponent,
    resolve: {
      rfbUser: RfbUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RfbUserUpdateComponent,
    resolve: {
      rfbUser: RfbUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rfbUserRoute;
