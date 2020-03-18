import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'koppr-card',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.scss']
})
export class AddNewUserComponent implements OnInit {

    isVisible = false;
    isConfirmLoading = false;
  constructor() { }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnInit() {
  }

}
