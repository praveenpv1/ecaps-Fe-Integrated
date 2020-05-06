import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  ADD_CHILD,
  GET_CHILD_USER_INFO,
  UPDATE_CHILD_USER_INFO,
  USER_EXTRA_DETAILS,
} from "./../../store/actions/index";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { DataStore } from "@app/core/store/app.store";

@Component({
  selector: "edit-account",
  templateUrl: "./edit-account.component.html",
  styleUrls: ["./edit-account.component.scss"],
})
export class EditAccountComponent implements OnInit {
  validateForm: FormGroup;
  isFormValid: boolean = false;
  userDetails: any = null;
  initialState: any;
  constructor(
    private fb: FormBuilder,
    private child: UserReducers,
    private activatedRoute: ActivatedRoute,
    private _dataStore: DataStore
  ) {
    this.initialState = this._dataStore.dataStore$.getValue();
    this.child.userReducer({
      type: USER_EXTRA_DETAILS,
      // payload: { id: this.initialState.userInfo._id },
    });

    this.createForm();
  }

  createForm() {
    this.validateForm = this.fb.group({
      first_name: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*")],
      ],
      last_name: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*")],
      ],
      // company_name: [null],
      dateOfBirth: [null, [Validators.required]],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      userName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      // password: [null],
      role: [null, [Validators.required]],
      pan: [null, [Validators.required]],
      aadhaarNo: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
      voterId: [null, [Validators.required]],
      kitNo: [null, [Validators.required]],
    });
    this.validateForm.controls.role.disable();
  }

  submitForm() {
    const store = this._dataStore.dataStore$.getValue();
    console.log("userDetails", this.userDetails);

    // this.isFormValid =
    //   _.get(this.validateForm, "status", "INVALID") === "VALID";
    // console.log(
    //   moment(this.validateForm.controls.dateOfBirth.value).format("DD-MM-YYYY")
    // );
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (!_.isEmpty(this.userDetails)) {
        this.child.userReducer({
          type: UPDATE_CHILD_USER_INFO,
          payload: {
            id: this.userDetails._id,
            dob: moment(this.validateForm.controls.dateOfBirth.value).format(
              "DD-MM-YYYY"
            ),
            // is_verified: true,
            // status: true,
            // tpin: "",
            aadhaar: this.validateForm.controls.aadhaarNo.value,
            pan: this.validateForm.controls.pan.value,
            voter_id: this.validateForm.controls.voterId.value,
            kit_number: this.validateForm.controls.kitNo.value,
            // wallet_balance: this.userDetails.wallet_balance,
            firstname: this.validateForm.controls.first_name.value,
            lastname: this.validateForm.controls.last_name.value,
            phone: this.validateForm.controls.phoneNumber.value,
            username: this.validateForm.controls.userName.value,
            email: this.validateForm.controls.email.value,
            role: this.validateForm.controls.role.value,
            updated_at: moment.utc().format(),
          },
          navigation: {
            path: "/my-account",
          },
        });
      }
    }
  }

  ngOnInit() {
    this._dataStore.dataStore$.subscribe((data) => {
      console.log("childUser", data.childUser);

      if (data.userExtraDetails) {
        this.userDetails = data.userExtraDetails;
        if (this.userDetails != null) {
          this.setDetails();
        }
      }
    });
  }

  setDetails() {
    console.log("userDetails", this.userDetails);

    if (!_.isEmpty(this.userDetails)) {
      this.validateForm.patchValue({
        first_name: this.userDetails.firstname,
        last_name: this.userDetails.lastname,
        company_name: this.userDetails.company_name,
        dateOfBirth: moment(this.userDetails.dob, "DD-MM-YYYY").format(
          "MM-DD-YYYY"
        ),
        phoneNumber: this.userDetails.phone,
        userName: this.userDetails.username,
        email: this.userDetails.email,
        // password: "",
        role: this.userDetails.role,
        pan: this.userDetails.pan,
        aadhaarNo: this.userDetails.aadhaar,
        voterId: this.userDetails.voter_id,
        kitNo: this.userDetails.kit_number,
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
}
