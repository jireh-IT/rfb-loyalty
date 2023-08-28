import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RfbUserService } from '../service/rfb-user.service';

import { RfbUserComponent } from './rfb-user.component';

describe('RfbUser Management Component', () => {
  let comp: RfbUserComponent;
  let fixture: ComponentFixture<RfbUserComponent>;
  let service: RfbUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'rfb-user', component: RfbUserComponent }]),
        HttpClientTestingModule,
        RfbUserComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(RfbUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RfbUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RfbUserService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.rfbUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to rfbUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRfbUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRfbUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
