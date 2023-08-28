import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 17015,
};

export const sampleWithPartialData: ILocation = {
  id: 22908,
};

export const sampleWithFullData: ILocation = {
  id: 8624,
  locationName: 'throughout Nakfa',
  runDayOfWeek: 17590,
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
