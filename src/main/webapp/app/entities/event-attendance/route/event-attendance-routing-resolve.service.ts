import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEventAttendance } from '../event-attendance.model';
import { EventAttendanceService } from '../service/event-attendance.service';

export const eventAttendanceResolve = (route: ActivatedRouteSnapshot): Observable<null | IEventAttendance> => {
  const id = route.params['id'];
  if (id) {
    return inject(EventAttendanceService)
      .find(id)
      .pipe(
        mergeMap((eventAttendance: HttpResponse<IEventAttendance>) => {
          if (eventAttendance.body) {
            return of(eventAttendance.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default eventAttendanceResolve;
