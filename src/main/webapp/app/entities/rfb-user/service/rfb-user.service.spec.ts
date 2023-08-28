import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRfbUser } from '../rfb-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../rfb-user.test-samples';

import { RfbUserService } from './rfb-user.service';

const requireRestSample: IRfbUser = {
  ...sampleWithRequiredData,
};

describe('RfbUser Service', () => {
  let service: RfbUserService;
  let httpMock: HttpTestingController;
  let expectedResult: IRfbUser | IRfbUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RfbUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a RfbUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rfbUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rfbUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RfbUser', () => {
      const rfbUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rfbUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RfbUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RfbUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RfbUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRfbUserToCollectionIfMissing', () => {
      it('should add a RfbUser to an empty array', () => {
        const rfbUser: IRfbUser = sampleWithRequiredData;
        expectedResult = service.addRfbUserToCollectionIfMissing([], rfbUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rfbUser);
      });

      it('should not add a RfbUser to an array that contains it', () => {
        const rfbUser: IRfbUser = sampleWithRequiredData;
        const rfbUserCollection: IRfbUser[] = [
          {
            ...rfbUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRfbUserToCollectionIfMissing(rfbUserCollection, rfbUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RfbUser to an array that doesn't contain it", () => {
        const rfbUser: IRfbUser = sampleWithRequiredData;
        const rfbUserCollection: IRfbUser[] = [sampleWithPartialData];
        expectedResult = service.addRfbUserToCollectionIfMissing(rfbUserCollection, rfbUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rfbUser);
      });

      it('should add only unique RfbUser to an array', () => {
        const rfbUserArray: IRfbUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rfbUserCollection: IRfbUser[] = [sampleWithRequiredData];
        expectedResult = service.addRfbUserToCollectionIfMissing(rfbUserCollection, ...rfbUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rfbUser: IRfbUser = sampleWithRequiredData;
        const rfbUser2: IRfbUser = sampleWithPartialData;
        expectedResult = service.addRfbUserToCollectionIfMissing([], rfbUser, rfbUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rfbUser);
        expect(expectedResult).toContain(rfbUser2);
      });

      it('should accept null and undefined values', () => {
        const rfbUser: IRfbUser = sampleWithRequiredData;
        expectedResult = service.addRfbUserToCollectionIfMissing([], null, rfbUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rfbUser);
      });

      it('should return initial array if no RfbUser is added', () => {
        const rfbUserCollection: IRfbUser[] = [sampleWithRequiredData];
        expectedResult = service.addRfbUserToCollectionIfMissing(rfbUserCollection, undefined, null);
        expect(expectedResult).toEqual(rfbUserCollection);
      });
    });

    describe('compareRfbUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRfbUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRfbUser(entity1, entity2);
        const compareResult2 = service.compareRfbUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRfbUser(entity1, entity2);
        const compareResult2 = service.compareRfbUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRfbUser(entity1, entity2);
        const compareResult2 = service.compareRfbUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
