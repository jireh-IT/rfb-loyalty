import { IRfbUser, NewRfbUser } from './rfb-user.model';

export const sampleWithRequiredData: IRfbUser = {
  id: 10955,
  username: 'Customer parse',
};

export const sampleWithPartialData: IRfbUser = {
  id: 30763,
  username: 'Technician Southeast depend',
};

export const sampleWithFullData: IRfbUser = {
  id: 13843,
  username: 'Northeast Transgender Iran',
};

export const sampleWithNewData: NewRfbUser = {
  username: 'North kelvin',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
