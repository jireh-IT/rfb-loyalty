import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEventAttendance, NewEventAttendance } from '../event-attendance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEventAttendance for edit and NewEventAttendanceFormGroupInput for create.
 */
type EventAttendanceFormGroupInput = IEventAttendance | PartialWithRequiredKeyOf<NewEventAttendance>;

type EventAttendanceFormDefaults = Pick<NewEventAttendance, 'id'>;

type EventAttendanceFormGroupContent = {
  id: FormControl<IEventAttendance['id'] | NewEventAttendance['id']>;
  attendanceDate: FormControl<IEventAttendance['attendanceDate']>;
  rfbUser: FormControl<IEventAttendance['rfbUser']>;
  event: FormControl<IEventAttendance['event']>;
};

export type EventAttendanceFormGroup = FormGroup<EventAttendanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventAttendanceFormService {
  createEventAttendanceFormGroup(eventAttendance: EventAttendanceFormGroupInput = { id: null }): EventAttendanceFormGroup {
    const eventAttendanceRawValue = {
      ...this.getFormDefaults(),
      ...eventAttendance,
    };
    return new FormGroup<EventAttendanceFormGroupContent>({
      id: new FormControl(
        { value: eventAttendanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      attendanceDate: new FormControl(eventAttendanceRawValue.attendanceDate),
      rfbUser: new FormControl(eventAttendanceRawValue.rfbUser),
      event: new FormControl(eventAttendanceRawValue.event),
    });
  }

  getEventAttendance(form: EventAttendanceFormGroup): IEventAttendance | NewEventAttendance {
    return form.getRawValue() as IEventAttendance | NewEventAttendance;
  }

  resetForm(form: EventAttendanceFormGroup, eventAttendance: EventAttendanceFormGroupInput): void {
    const eventAttendanceRawValue = { ...this.getFormDefaults(), ...eventAttendance };
    form.reset(
      {
        ...eventAttendanceRawValue,
        id: { value: eventAttendanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventAttendanceFormDefaults {
    return {
      id: null,
    };
  }
}
