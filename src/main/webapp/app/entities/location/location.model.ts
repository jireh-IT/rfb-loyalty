export interface ILocation {
  id: number;
  locationName?: string | null;
  runDayOfWeek?: number | null;
}

export type NewLocation = Omit<ILocation, 'id'> & { id: null };
