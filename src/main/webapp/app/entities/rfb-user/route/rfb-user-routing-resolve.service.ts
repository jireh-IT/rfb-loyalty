import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRfbUser } from '../rfb-user.model';
import { RfbUserService } from '../service/rfb-user.service';

export const rfbUserResolve = (route: ActivatedRouteSnapshot): Observable<null | IRfbUser> => {
  const id = route.params['id'];
  if (id) {
    return inject(RfbUserService)
      .find(id)
      .pipe(
        mergeMap((rfbUser: HttpResponse<IRfbUser>) => {
          if (rfbUser.body) {
            return of(rfbUser.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default rfbUserResolve;
