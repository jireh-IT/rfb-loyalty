import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventAttendanceFormService, EventAttendanceFormGroup } from './event-attendance-form.service';
import { IEventAttendance } from '../event-attendance.model';
import { EventAttendanceService } from '../service/event-attendance.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';
import { IRfbUser } from 'app/entities/rfb-user/rfb-user.model';
import { RfbUserService } from 'app/entities/rfb-user/service/rfb-user.service';

@Component({
  standalone: true,
  selector: 'jhi-event-attendance-update',
  templateUrl: './event-attendance-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EventAttendanceUpdateComponent implements OnInit {
  isSaving = false;
  eventAttendance: IEventAttendance | null = null;

  eventsSharedCollection: IEvent[] = [];
  rfbUsersSharedCollection: IRfbUser[] = [];

  editForm: EventAttendanceFormGroup = this.eventAttendanceFormService.createEventAttendanceFormGroup();

  constructor(
    protected eventAttendanceService: EventAttendanceService,
    protected eventAttendanceFormService: EventAttendanceFormService,
    protected eventService: EventService,
    protected rfbUserService: RfbUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  compareRfbUser = (o1: IRfbUser | null, o2: IRfbUser | null): boolean => this.rfbUserService.compareRfbUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ eventAttendance }) => {
      this.eventAttendance = eventAttendance;
      if (eventAttendance) {
        this.updateForm(eventAttendance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const eventAttendance = this.eventAttendanceFormService.getEventAttendance(this.editForm);
    if (eventAttendance.id !== null) {
      this.subscribeToSaveResponse(this.eventAttendanceService.update(eventAttendance));
    } else {
      this.subscribeToSaveResponse(this.eventAttendanceService.create(eventAttendance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventAttendance>>): void {
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

  protected updateForm(eventAttendance: IEventAttendance): void {
    this.eventAttendance = eventAttendance;
    this.eventAttendanceFormService.resetForm(this.editForm, eventAttendance);

    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(
      this.eventsSharedCollection,
      eventAttendance.event
    );
    this.rfbUsersSharedCollection = this.rfbUserService.addRfbUserToCollectionIfMissing<IRfbUser>(
      this.rfbUsersSharedCollection,
      eventAttendance.rfbUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.eventAttendance?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));

    this.rfbUserService
      .query()
      .pipe(map((res: HttpResponse<IRfbUser[]>) => res.body ?? []))
      .pipe(
        map((rfbUsers: IRfbUser[]) =>
          this.rfbUserService.addRfbUserToCollectionIfMissing<IRfbUser>(rfbUsers, this.eventAttendance?.rfbUser)
        )
      )
      .subscribe((rfbUsers: IRfbUser[]) => (this.rfbUsersSharedCollection = rfbUsers));
  }
}
