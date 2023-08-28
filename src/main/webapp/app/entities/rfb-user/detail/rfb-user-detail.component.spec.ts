import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RfbUserDetailComponent } from './rfb-user-detail.component';

describe('RfbUser Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfbUserDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RfbUserDetailComponent,
              resolve: { rfbUser: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(RfbUserDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load rfbUser on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RfbUserDetailComponent);

      // THEN
      expect(instance.rfbUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
