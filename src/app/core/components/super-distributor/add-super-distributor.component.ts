import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ADD_CHILD,GET_CHILD_USER } from "./../../store/actions/index";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { DataStore } from "@app/core/store/app.store";
@Component({
  selector: "app-addnewuser",
  templateUrl: "./add-super-distributor.component.html",
  styleUrls: ["./add-super-distributor.component.scss"]
})
export class AddSuperDistributorComponent implements OnInit {
  validateForm: FormGroup;
  _id: string = "";
  isFormValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private child: UserReducers,
    private activatedRoute: ActivatedRoute,
    private _dataStore: DataStore
  ) {}

  submitForm() {
    const store = this._dataStore.dataStore$.getValue();

    this.isFormValid =
      _.get(this.validateForm, "status", "INVALID") === "VALID";
    console.log(
      moment(this.validateForm.controls.dateOfBirth.value).format("DD-MM-YYYY")
    );
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.isFormValid) {
      this.child.userReducer({
        type: ADD_CHILD,
        payload: {
          pid: store.userInfo._id,
          role: "superdistributor",
          firstname: this.validateForm.controls.first_name.value,
          lastname: this.validateForm.controls.last_name.value,
          company_name: this.validateForm.controls.company_name.value,
          dob: moment(this.validateForm.controls.dateOfBirth.value).format(
            "DD-MM-YYYY"
          ),
          phone: `+91${this.validateForm.controls.phoneNumber.value}`,
          username: this.validateForm.controls.userName.value,
          email: this.validateForm.controls.email.value,
          password: this.validateForm.controls.password.value,
          created_by: store.userInfo._id,
          aadhaar: this.validateForm.controls.aadhaarNo.value,
          pan: this.validateForm.controls.pan.value,
          voter_id: this.validateForm.controls.voterId.value,
          kit_number: this.validateForm.controls.kitNo.value
        }
      });
    }
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this._id = this.activatedRoute.snapshot.paramMap.get("id");
    }
    if (this._id != "") {

        this.child.userReducer({
        type: GET_CHILD_USER,
        payload: {
          id: this._id
        }
      });
    }
    this.validateForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company_name: [null, [Validators.required]],
      dateOfBirth: [null],
      phoneNumberPrefix: ["+91"],
      phoneNumber: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      role: ["Super Distributor", [Validators.required]],
      pan: [null, [Validators.required]],
      aadhaarNo: [null, [Validators.required]],
      voterId: [null, [Validators.required]],
      kitNo: [null, [Validators.required]]
      // selectedMargin: [null, [Validators.required]],
      // nonRefundableAmount: [null, [Validators.required]],
      // securityAmount: [null, [Validators.required]],
      // paymentMode: [null, [Validators.required]],
      // paymentBank: [null, [Validators.required]],
      // paymentReferenceNo:[null, [Validators.required]],
      // paymentDate: [null],
      // paymentRemarks: ['', [Validators.required]],
      // kitsIssued: [null, [Validators.required]],
      // rate: [null, [Validators.required]],
      // complementaryKits: [null, [Validators.required]],
      // kitsRemarks: ['', [Validators.required]]
    });
  }
}
