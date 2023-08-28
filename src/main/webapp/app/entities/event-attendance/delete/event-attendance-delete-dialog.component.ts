import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IEventAttendance } from '../event-attendance.model';
import { EventAttendanceService } from '../service/event-attendance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './event-attendance-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EventAttendanceDeleteDialogComponent {
  eventAttendance?: IEventAttendance;

  constructor(protected eventAttendanceService: EventAttendanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id?: number): void {
    if (id) {
      this.eventAttendanceService.delete(id).subscribe(() => {
        this.activeModal.close(ITEM_DELETED_EVENT);
      });
    }
  }
}
