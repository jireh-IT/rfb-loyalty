import dayjs from 'dayjs/esm';

import { IEventAttendance, NewEventAttendance } from './event-attendance.model';

export const sampleWithRequiredData: IEventAttendance = {
  id: 16718,
};

export const sampleWithPartialData: IEventAttendance = {
  id: 6208,
  attendanceDate: dayjs('2023-08-27'),
};

export const sampleWithFullData: IEventAttendance = {
  id: 17576,
  attendanceDate: dayjs('2023-08-28'),
};

export const sampleWithNewData: NewEventAttendance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
