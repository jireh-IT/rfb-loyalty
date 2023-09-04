import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../event-attendance.test-samples';

import { EventAttendanceFormService } from './event-attendance-form.service';

describe('EventAttendance Form Service', () => {
  let service: EventAttendanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventAttendanceFormService);
  });

  describe('Service methods', () => {
    describe('createEventAttendanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEventAttendanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            attendanceDate: expect.any(Object),
            event: expect.any(Object),
            rfbUser: expect.any(Object),
          })
        );
      });

      it('passing IEventAttendance should create a new form with FormGroup', () => {
        const formGroup = service.createEventAttendanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            attendanceDate: expect.any(Object),
            event: expect.any(Object),
            rfbUser: expect.any(Object),
          })
        );
      });
    });

    describe('getEventAttendance', () => {
      it('should return NewEventAttendance for default EventAttendance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEventAttendanceFormGroup(sampleWithNewData);

        const eventAttendance = service.getEventAttendance(formGroup) as any;

        expect(eventAttendance).toMatchObject(sampleWithNewData);
      });

      it('should return NewEventAttendance for empty EventAttendance initial value', () => {
        const formGroup = service.createEventAttendanceFormGroup();

        const eventAttendance = service.getEventAttendance(formGroup) as any;

        expect(eventAttendance).toMatchObject({});
      });

      it('should return IEventAttendance', () => {
        const formGroup = service.createEventAttendanceFormGroup(sampleWithRequiredData);

        const eventAttendance = service.getEventAttendance(formGroup) as any;

        expect(eventAttendance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEventAttendance should not enable id FormControl', () => {
        const formGroup = service.createEventAttendanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEventAttendance should disable id FormControl', () => {
        const formGroup = service.createEventAttendanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
