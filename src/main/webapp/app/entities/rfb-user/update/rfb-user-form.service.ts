import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRfbUser, NewRfbUser } from '../rfb-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRfbUser for edit and NewRfbUserFormGroupInput for create.
 */
type RfbUserFormGroupInput = IRfbUser | PartialWithRequiredKeyOf<NewRfbUser>;

type RfbUserFormDefaults = Pick<NewRfbUser, 'id'>;

type RfbUserFormGroupContent = {
  id: FormControl<IRfbUser['id'] | NewRfbUser['id']>;
  username: FormControl<IRfbUser['username']>;
  homeLocation: FormControl<IRfbUser['homeLocation']>;
};

export type RfbUserFormGroup = FormGroup<RfbUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RfbUserFormService {
  createRfbUserFormGroup(rfbUser: RfbUserFormGroupInput = { id: null }): RfbUserFormGroup {
    const rfbUserRawValue = {
      ...this.getFormDefaults(),
      ...rfbUser,
    };
    return new FormGroup<RfbUserFormGroupContent>({
      id: new FormControl(
        { value: rfbUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(rfbUserRawValue.username, {
        validators: [Validators.required],
      }),
      homeLocation: new FormControl(rfbUserRawValue.homeLocation),
    });
  }

  getRfbUser(form: RfbUserFormGroup): IRfbUser | NewRfbUser {
    return form.getRawValue() as IRfbUser | NewRfbUser;
  }

  resetForm(form: RfbUserFormGroup, rfbUser: RfbUserFormGroupInput): void {
    const rfbUserRawValue = { ...this.getFormDefaults(), ...rfbUser };
    form.reset(
      {
        ...rfbUserRawValue,
        id: { value: rfbUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RfbUserFormDefaults {
    return {
      id: null,
    };
  }
}
