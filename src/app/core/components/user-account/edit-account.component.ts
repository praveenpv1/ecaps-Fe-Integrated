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
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      // company_name: [null],
      dateOfBirth: [null],
      phoneNumber: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      // password: [null],
      role: ["role", [Validators.required]],
      pan: [null, [Validators.required]],
      aadhaarNo: [null, [Validators.required]],
      voterId: [null, [Validators.required]],
      kitNo: [null, [Validators.required]],    
    });
    this.validateForm.controls.role.disable();
  }

}
