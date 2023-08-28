import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 29487,
};

export const sampleWithPartialData: IEvent = {
  id: 15664,
};

export const sampleWithFullData: IEvent = {
  id: 16493,
  eventDate: dayjs('2023-08-28'),
  eventCode: 'Southwest',
};

export const sampleWithNewData: NewEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
