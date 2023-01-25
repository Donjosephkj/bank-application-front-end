import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css'],
})
export class DeleteConfirmationComponent {
  @Input() item: string | undefined;
  //to create user defined event
  @Output() onCancel = new EventEmitter();
  @Output() onDelete=new EventEmitter()

  cancel() {
    //to occur user defined events
    this.onCancel.emit();
  }
  deleteAcc(){
    this.onDelete.emit(this.item)
  }
}
