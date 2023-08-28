import { ILocation } from 'app/entities/location/location.model';

export interface IRfbUser {
  id: number;
  username?: string | null;
  homeLocation?: Pick<ILocation, 'id'> | null;
}

export type NewRfbUser = Omit<IRfbUser, 'id'> & { id: null };
