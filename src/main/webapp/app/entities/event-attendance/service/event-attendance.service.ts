import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEventAttendance, NewEventAttendance } from '../event-attendance.model';

export type PartialUpdateEventAttendance = Partial<IEventAttendance> & Pick<IEventAttendance, 'id'>;

type RestOf<T extends IEventAttendance | NewEventAttendance> = Omit<T, 'attendanceDate'> & {
  attendanceDate?: string | null;
};

export type RestEventAttendance = RestOf<IEventAttendance>;

export type NewRestEventAttendance = RestOf<NewEventAttendance>;

export type PartialUpdateRestEventAttendance = RestOf<PartialUpdateEventAttendance>;

export type EntityResponseType = HttpResponse<IEventAttendance>;
export type EntityArrayResponseType = HttpResponse<IEventAttendance[]>;

@Injectable({ providedIn: 'root' })
export class EventAttendanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/event-attendances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(eventAttendance: NewEventAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventAttendance);
    return this.http
      .post<RestEventAttendance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(eventAttendance: IEventAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventAttendance);
    return this.http
      .put<RestEventAttendance>(`${this.resourceUrl}/${this.getEventAttendanceIdentifier(eventAttendance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(eventAttendance: PartialUpdateEventAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eventAttendance);
    return this.http
      .patch<RestEventAttendance>(`${this.resourceUrl}/${this.getEventAttendanceIdentifier(eventAttendance)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEventAttendance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEventAttendance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEventAttendanceIdentifier(eventAttendance: Pick<IEventAttendance, 'id'>): number {
    return eventAttendance.id;
  }

  compareEventAttendance(o1: Pick<IEventAttendance, 'id'> | null, o2: Pick<IEventAttendance, 'id'> | null): boolean {
    return o1 && o2 ? this.getEventAttendanceIdentifier(o1) === this.getEventAttendanceIdentifier(o2) : o1 === o2;
  }

  addEventAttendanceToCollectionIfMissing<Type extends Pick<IEventAttendance, 'id'>>(
    eventAttendanceCollection: Type[],
    ...eventAttendancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const eventAttendances: Type[] = eventAttendancesToCheck.filter(isPresent);
    if (eventAttendances.length > 0) {
      const eventAttendanceCollectionIdentifiers = eventAttendanceCollection.map(
        eventAttendanceItem => this.getEventAttendanceIdentifier(eventAttendanceItem)!
      );
      const eventAttendancesToAdd = eventAttendances.filter(eventAttendanceItem => {
        const eventAttendanceIdentifier = this.getEventAttendanceIdentifier(eventAttendanceItem);
        if (eventAttendanceCollectionIdentifiers.includes(eventAttendanceIdentifier)) {
          return false;
        }
        eventAttendanceCollectionIdentifiers.push(eventAttendanceIdentifier);
        return true;
      });
      return [...eventAttendancesToAdd, ...eventAttendanceCollection];
    }
    return eventAttendanceCollection;
  }

  protected convertDateFromClient<T extends IEventAttendance | NewEventAttendance | PartialUpdateEventAttendance>(
    eventAttendance: T
  ): RestOf<T> {
    return {
      ...eventAttendance,
      attendanceDate: eventAttendance.attendanceDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEventAttendance: RestEventAttendance): IEventAttendance {
    return {
      ...restEventAttendance,
      attendanceDate: restEventAttendance.attendanceDate ? dayjs(restEventAttendance.attendanceDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEventAttendance>): HttpResponse<IEventAttendance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEventAttendance[]>): HttpResponse<IEventAttendance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
