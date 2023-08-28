import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRfbUser, NewRfbUser } from '../rfb-user.model';

export type PartialUpdateRfbUser = Partial<IRfbUser> & Pick<IRfbUser, 'id'>;

export type EntityResponseType = HttpResponse<IRfbUser>;
export type EntityArrayResponseType = HttpResponse<IRfbUser[]>;

@Injectable({ providedIn: 'root' })
export class RfbUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rfb-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rfbUser: NewRfbUser): Observable<EntityResponseType> {
    return this.http.post<IRfbUser>(this.resourceUrl, rfbUser, { observe: 'response' });
  }

  update(rfbUser: IRfbUser): Observable<EntityResponseType> {
    return this.http.put<IRfbUser>(`${this.resourceUrl}/${this.getRfbUserIdentifier(rfbUser)}`, rfbUser, { observe: 'response' });
  }

  partialUpdate(rfbUser: PartialUpdateRfbUser): Observable<EntityResponseType> {
    return this.http.patch<IRfbUser>(`${this.resourceUrl}/${this.getRfbUserIdentifier(rfbUser)}`, rfbUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRfbUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRfbUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRfbUserIdentifier(rfbUser: Pick<IRfbUser, 'id'>): number {
    return rfbUser.id;
  }

  compareRfbUser(o1: Pick<IRfbUser, 'id'> | null, o2: Pick<IRfbUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getRfbUserIdentifier(o1) === this.getRfbUserIdentifier(o2) : o1 === o2;
  }

  addRfbUserToCollectionIfMissing<Type extends Pick<IRfbUser, 'id'>>(
    rfbUserCollection: Type[],
    ...rfbUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rfbUsers: Type[] = rfbUsersToCheck.filter(isPresent);
    if (rfbUsers.length > 0) {
      const rfbUserCollectionIdentifiers = rfbUserCollection.map(rfbUserItem => this.getRfbUserIdentifier(rfbUserItem)!);
      const rfbUsersToAdd = rfbUsers.filter(rfbUserItem => {
        const rfbUserIdentifier = this.getRfbUserIdentifier(rfbUserItem);
        if (rfbUserCollectionIdentifiers.includes(rfbUserIdentifier)) {
          return false;
        }
        rfbUserCollectionIdentifiers.push(rfbUserIdentifier);
        return true;
      });
      return [...rfbUsersToAdd, ...rfbUserCollection];
    }
    return rfbUserCollection;
  }
}
