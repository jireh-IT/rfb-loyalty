import dayjs from 'dayjs/esm';
import { ILocation } from 'app/entities/location/location.model';

export interface IEvent {
  id: number;
  eventDate?: dayjs.Dayjs | null;
  eventCode?: string | null;
  location?: Pick<ILocation, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
