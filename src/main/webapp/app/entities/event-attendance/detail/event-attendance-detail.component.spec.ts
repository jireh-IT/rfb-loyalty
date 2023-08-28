import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EventAttendanceDetailComponent } from './event-attendance-detail.component';

describe('EventAttendance Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EventAttendanceDetailComponent,
              resolve: { eventAttendance: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(EventAttendanceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load eventAttendance on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EventAttendanceDetailComponent);

      // THEN
      expect(instance.eventAttendance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
