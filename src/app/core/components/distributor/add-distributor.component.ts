import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
// import {
//   ADD_CHILD,
//   GET_CHILD_USER_INFO,
//   UPDATE_CHILD_USER_INFO,
// } from "./../../store/actions/index";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
// import { UserReducers } from "@app/core/store/reducers/user.reducer";
// import { DataStore } from "@app/core/store/app.store";
import { Store } from "@ngxs/store";
import {
  AddChildUserAction,
  GetChildUserInfoAction,
  UpdateChildUserInfoAction,
} from "@app/core/ngxs-store/ngxs-actions/user.actions";

@Component({
  selector: "app-addnewuser",
  templateUrl: "./add-distributor.component.html",
  styleUrls: ["./add-distributor.component.scss"],
})
export class AddDistributorComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  _id: string = "";
  isFormValid: boolean = false;
  userDetails: any;
  userInfo: any;
  storeSubscriber: any;
  constructor(
    private fb: FormBuilder,
    // private child: UserReducers,
    // private _dataStore: DataStore,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (!_.isEmpty(this._id)) {
        if (!_.isEmpty(this.userDetails)) {
          const payload = {
            id: this._id,
            dob: moment(this.validateForm.controls.dateOfBirth.value).format(
              "DD-MM-YYYY"
            ),
            aadhaar: this.validateForm.controls.aadhaarNo.value,
            pan: this.validateForm.controls.pan.value,
            voter_id: this.validateForm.controls.voterId.value,
            kit_number: this.validateForm.controls.kitNo.value,
            firstname: this.validateForm.controls.first_name.value,
            lastname: this.validateForm.controls.last_name.value,
            phone: this.validateForm.controls.phoneNumber.value,
            username: this.validateForm.controls.userName.value,
            email: this.validateForm.controls.email.value,
            role: "distributor",
            updated_at: moment.utc().format(),
          };

          const navigation = {
            path: "/distributor",
          };

          this.store.dispatch(
            new UpdateChildUserInfoAction(payload, navigation)
          );
        }
      } else {
        const payload = {
          pid: this.userInfo._id,
          role: "distributor",
          firstname: this.validateForm.controls.first_name.value,
          lastname: this.validateForm.controls.last_name.value,
          company_name: this.validateForm.controls.company_name.value,
          dob: moment(this.validateForm.controls.dateOfBirth.value).format(
            "DD-MM-YYYY"
          ),
          phone: this.validateForm.controls.phoneNumber.value,
          username: this.validateForm.controls.userName.value,
          email: this.validateForm.controls.email.value,
          password: this.validateForm.controls.password.value,
          created_by: this.userInfo._id,
          aadhaar: this.validateForm.controls.aadhaarNo.value,
          pan: this.validateForm.controls.pan.value,
          voter_id: this.validateForm.controls.voterId.value,
          kit_number: this.validateForm.controls.kitNo.value,
        };
        this.store.dispatch(new AddChildUserAction(payload));
      }
    }
  }

  ngOnDestroy() {
    this.storeSubscriber.unsubscribe();
  }

  ngOnInit() {
    this.setForm({});

    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this._id = this.activatedRoute.snapshot.paramMap.get("id");
    }
    console.log("IDD", this._id, !_.isEmpty(this._id));

    if (!_.isEmpty(this._id)) {
      // this.child.userReducer({
      //   type: GET_CHILD_USER_INFO,
      //   payload: {
      //     id: this._id,
      //   },
      // });

      this.store.dispatch(new GetChildUserInfoAction(this._id));

      // this._dataStore.dataStore$.subscribe((data) => {
      //   if (data.childUser) {
      //     this.userDetails = data.childUser;
      //     if (this.userDetails != null) {
      //       this.setDetails({});
      //     }
      //   }
      // });
    }

    this.storeSubscriber = this.store.subscribe(({ userState }) => {
      console.log("userinfo state", userState.userInfo, userState);
      if (userState) {
        this.userInfo = userState.userInfo;

        if (userState.childUser) {
          this.userDetails = userState.childUser;
          if (this.userDetails != null) {
            this.setDetails({});
          }
        }
      }
    });
  }

  setDetails(data: any) {
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
        role: "Distributor",
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

  setForm(data: any) {
    this.validateForm = this.fb.group({
      first_name: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*")],
      ],
      last_name: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z ]*")],
      ],
      company_name: [null, [Validators.required]],
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
      password: [null],
      role: ["Distributor", [Validators.required]],
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
    this.validateForm.controls.role.disable();
  }
}
