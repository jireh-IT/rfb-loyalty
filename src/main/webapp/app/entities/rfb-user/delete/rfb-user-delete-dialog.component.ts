import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IRfbUser } from '../rfb-user.model';
import { RfbUserService } from '../service/rfb-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './rfb-user-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RfbUserDeleteDialogComponent {
  rfbUser?: IRfbUser;

  constructor(protected rfbUserService: RfbUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id?: number): void {
    if (id) {
      this.rfbUserService.delete(id).subscribe(() => {
        this.activeModal.close(ITEM_DELETED_EVENT);
      });
    }
  }
}
