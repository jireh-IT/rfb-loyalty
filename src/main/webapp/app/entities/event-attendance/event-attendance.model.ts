import dayjs from 'dayjs/esm';
import { IRfbUser } from 'app/entities/rfb-user/rfb-user.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IEventAttendance {
  id: number;
  attendanceDate?: dayjs.Dayjs | null;
  rfbUser?: Pick<IRfbUser, 'id'> | null;
  event?: Pick<IEvent, 'id'> | null;
}

export type NewEventAttendance = Omit<IEventAttendance, 'id'> & { id: null };
