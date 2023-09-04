import dayjs from 'dayjs/esm';
import { IEvent } from 'app/entities/event/event.model';
import { IRfbUser } from 'app/entities/rfb-user/rfb-user.model';

export interface IEventAttendance {
  id: number;
  attendanceDate?: dayjs.Dayjs | null;
  event?: Pick<IEvent, 'id'> | null;
  rfbUser?: Pick<IRfbUser, 'id'> | null;
}

export type NewEventAttendance = Omit<IEventAttendance, 'id'> & { id: null };
