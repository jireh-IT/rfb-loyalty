import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RfbUserFormService, RfbUserFormGroup } from './rfb-user-form.service';
import { IRfbUser } from '../rfb-user.model';
import { RfbUserService } from '../service/rfb-user.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  standalone: true,
  selector: 'jhi-rfb-user-update',
  templateUrl: './rfb-user-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RfbUserUpdateComponent implements OnInit {
  isSaving = false;
  rfbUser: IRfbUser | null = null;

  homeLocationsCollection: ILocation[] = [];

  editForm: RfbUserFormGroup = this.rfbUserFormService.createRfbUserFormGroup();

  constructor(
    protected rfbUserService: RfbUserService,
    protected rfbUserFormService: RfbUserFormService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rfbUser }) => {
      this.rfbUser = rfbUser;
      if (rfbUser) {
        this.updateForm(rfbUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rfbUser = this.rfbUserFormService.getRfbUser(this.editForm);
    if (rfbUser.id !== null) {
      this.subscribeToSaveResponse(this.rfbUserService.update(rfbUser));
    } else {
      this.subscribeToSaveResponse(this.rfbUserService.create(rfbUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRfbUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rfbUser: IRfbUser): void {
    this.rfbUser = rfbUser;
    this.rfbUserFormService.resetForm(this.editForm, rfbUser);

    this.homeLocationsCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(
      this.homeLocationsCollection,
      rfbUser.homeLocation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'rfbuser-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.rfbUser?.homeLocation)
        )
      )
      .subscribe((locations: ILocation[]) => (this.homeLocationsCollection = locations));
  }
}
