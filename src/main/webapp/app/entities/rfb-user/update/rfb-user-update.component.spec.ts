import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RfbUserFormService } from './rfb-user-form.service';
import { RfbUserService } from '../service/rfb-user.service';
import { IRfbUser } from '../rfb-user.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { RfbUserUpdateComponent } from './rfb-user-update.component';

describe('RfbUser Management Update Component', () => {
  let comp: RfbUserUpdateComponent;
  let fixture: ComponentFixture<RfbUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rfbUserFormService: RfbUserFormService;
  let rfbUserService: RfbUserService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), RfbUserUpdateComponent],
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
      .overrideTemplate(RfbUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RfbUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rfbUserFormService = TestBed.inject(RfbUserFormService);
    rfbUserService = TestBed.inject(RfbUserService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call homeLocation query and add missing value', () => {
      const rfbUser: IRfbUser = { id: 456 };
      const homeLocation: ILocation = { id: 22010 };
      rfbUser.homeLocation = homeLocation;

      const homeLocationCollection: ILocation[] = [{ id: 2013 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: homeLocationCollection })));
      const expectedCollection: ILocation[] = [homeLocation, ...homeLocationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rfbUser });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(homeLocationCollection, homeLocation);
      expect(comp.homeLocationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rfbUser: IRfbUser = { id: 456 };
      const homeLocation: ILocation = { id: 5552 };
      rfbUser.homeLocation = homeLocation;

      activatedRoute.data = of({ rfbUser });
      comp.ngOnInit();

      expect(comp.homeLocationsCollection).toContain(homeLocation);
      expect(comp.rfbUser).toEqual(rfbUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRfbUser>>();
      const rfbUser = { id: 123 };
      jest.spyOn(rfbUserFormService, 'getRfbUser').mockReturnValue(rfbUser);
      jest.spyOn(rfbUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rfbUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rfbUser }));
      saveSubject.complete();

      // THEN
      expect(rfbUserFormService.getRfbUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rfbUserService.update).toHaveBeenCalledWith(expect.objectContaining(rfbUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRfbUser>>();
      const rfbUser = { id: 123 };
      jest.spyOn(rfbUserFormService, 'getRfbUser').mockReturnValue({ id: null });
      jest.spyOn(rfbUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rfbUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rfbUser }));
      saveSubject.complete();

      // THEN
      expect(rfbUserFormService.getRfbUser).toHaveBeenCalled();
      expect(rfbUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRfbUser>>();
      const rfbUser = { id: 123 };
      jest.spyOn(rfbUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rfbUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rfbUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
