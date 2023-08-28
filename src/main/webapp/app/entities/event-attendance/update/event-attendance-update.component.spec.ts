import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventAttendanceFormService } from './event-attendance-form.service';
import { EventAttendanceService } from '../service/event-attendance.service';
import { IEventAttendance } from '../event-attendance.model';
import { IRfbUser } from 'app/entities/rfb-user/rfb-user.model';
import { RfbUserService } from 'app/entities/rfb-user/service/rfb-user.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { EventAttendanceUpdateComponent } from './event-attendance-update.component';

describe('EventAttendance Management Update Component', () => {
  let comp: EventAttendanceUpdateComponent;
  let fixture: ComponentFixture<EventAttendanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventAttendanceFormService: EventAttendanceFormService;
  let eventAttendanceService: EventAttendanceService;
  let rfbUserService: RfbUserService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EventAttendanceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EventAttendanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventAttendanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventAttendanceFormService = TestBed.inject(EventAttendanceFormService);
    eventAttendanceService = TestBed.inject(EventAttendanceService);
    rfbUserService = TestBed.inject(RfbUserService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call rfbUser query and add missing value', () => {
      const eventAttendance: IEventAttendance = { id: 456 };
      const rfbUser: IRfbUser = { id: 1136 };
      eventAttendance.rfbUser = rfbUser;

      const rfbUserCollection: IRfbUser[] = [{ id: 732 }];
      jest.spyOn(rfbUserService, 'query').mockReturnValue(of(new HttpResponse({ body: rfbUserCollection })));
      const expectedCollection: IRfbUser[] = [rfbUser, ...rfbUserCollection];
      jest.spyOn(rfbUserService, 'addRfbUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventAttendance });
      comp.ngOnInit();

      expect(rfbUserService.query).toHaveBeenCalled();
      expect(rfbUserService.addRfbUserToCollectionIfMissing).toHaveBeenCalledWith(rfbUserCollection, rfbUser);
      expect(comp.rfbUsersCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const eventAttendance: IEventAttendance = { id: 456 };
      const event: IEvent = { id: 19699 };
      eventAttendance.event = event;

      const eventCollection: IEvent[] = [{ id: 4603 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ eventAttendance });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const eventAttendance: IEventAttendance = { id: 456 };
      const rfbUser: IRfbUser = { id: 18909 };
      eventAttendance.rfbUser = rfbUser;
      const event: IEvent = { id: 384 };
      eventAttendance.event = event;

      activatedRoute.data = of({ eventAttendance });
      comp.ngOnInit();

      expect(comp.rfbUsersCollection).toContain(rfbUser);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.eventAttendance).toEqual(eventAttendance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventAttendance>>();
      const eventAttendance = { id: 123 };
      jest.spyOn(eventAttendanceFormService, 'getEventAttendance').mockReturnValue(eventAttendance);
      jest.spyOn(eventAttendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventAttendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventAttendance }));
      saveSubject.complete();

      // THEN
      expect(eventAttendanceFormService.getEventAttendance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventAttendanceService.update).toHaveBeenCalledWith(expect.objectContaining(eventAttendance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventAttendance>>();
      const eventAttendance = { id: 123 };
      jest.spyOn(eventAttendanceFormService, 'getEventAttendance').mockReturnValue({ id: null });
      jest.spyOn(eventAttendanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventAttendance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventAttendance }));
      saveSubject.complete();

      // THEN
      expect(eventAttendanceFormService.getEventAttendance).toHaveBeenCalled();
      expect(eventAttendanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEventAttendance>>();
      const eventAttendance = { id: 123 };
      jest.spyOn(eventAttendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventAttendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventAttendanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRfbUser', () => {
      it('Should forward to rfbUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(rfbUserService, 'compareRfbUser');
        comp.compareRfbUser(entity, entity2);
        expect(rfbUserService.compareRfbUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEvent', () => {
      it('Should forward to eventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventService, 'compareEvent');
        comp.compareEvent(entity, entity2);
        expect(eventService.compareEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
