import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../rfb-user.test-samples';

import { RfbUserFormService } from './rfb-user-form.service';

describe('RfbUser Form Service', () => {
  let service: RfbUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfbUserFormService);
  });

  describe('Service methods', () => {
    describe('createRfbUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRfbUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            homeLocation: expect.any(Object),
          })
        );
      });

      it('passing IRfbUser should create a new form with FormGroup', () => {
        const formGroup = service.createRfbUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            username: expect.any(Object),
            homeLocation: expect.any(Object),
          })
        );
      });
    });

    describe('getRfbUser', () => {
      it('should return NewRfbUser for default RfbUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRfbUserFormGroup(sampleWithNewData);

        const rfbUser = service.getRfbUser(formGroup) as any;

        expect(rfbUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewRfbUser for empty RfbUser initial value', () => {
        const formGroup = service.createRfbUserFormGroup();

        const rfbUser = service.getRfbUser(formGroup) as any;

        expect(rfbUser).toMatchObject({});
      });

      it('should return IRfbUser', () => {
        const formGroup = service.createRfbUserFormGroup(sampleWithRequiredData);

        const rfbUser = service.getRfbUser(formGroup) as any;

        expect(rfbUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRfbUser should not enable id FormControl', () => {
        const formGroup = service.createRfbUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRfbUser should disable id FormControl', () => {
        const formGroup = service.createRfbUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
