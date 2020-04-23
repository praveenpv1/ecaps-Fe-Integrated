import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  validateForm: FormGroup;
  isFormValid: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({ 
      first_name: [null, [Validators.required,
        Validators.pattern('[a-zA-Z ]*')]],
      last_name: [null, [Validators.required,
        Validators.pattern('[a-zA-Z ]*')]],
      // company_name: [null],
      dateOfBirth: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.minLength(10),
        Validators.maxLength(10)]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      // password: [null],
      role: [null, [Validators.required]],
      pan: [null, [Validators.required]],
      aadhaarNo: [null, [Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.minLength(12),
        Validators.maxLength(12)]],
      voterId: [null, [Validators.required]],
      kitNo: [null, [Validators.required]],    
    });
    this.validateForm.controls.role.disable();
  }

}
