import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addnewuser',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss']
})
export class AddDistributorComponent implements OnInit {
  validateForm: FormGroup; 

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({ 
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company_name: [null, [Validators.required]],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],  
      selectedMargin: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      dateOfBirth: [null],
      pan: [null, [Validators.required]],
      aadhaarNo: [null, [Validators.required]],
      voterId: [null, [Validators.required]],
      nonRefundableAmount: [null, [Validators.required]],
      securityAmount: [null, [Validators.required]],
      paymentMode: [null, [Validators.required]],
      paymentBank: [null, [Validators.required]],
      paymentReferenceNo:[null, [Validators.required]],
      paymentDate: [null],
      paymentRemarks: ['', [Validators.required]],
      kitsIssued: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      complementaryKits: [null, [Validators.required]],
      kitsRemarks: ['', [Validators.required]]



    });
  }

}
