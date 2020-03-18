import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import {
  EMPLOYEE_CREATE,
  FETCH_USER_GRAPHQL,
  CREATE_EMPLOYEE_CONTACT,
  GET_EMPLOYEE
} from "@app/core/store/actions";
import { ModalReducers } from "@app/core/store/reducers/modal.reducer";
import { SHOW_MODAL } from "@app/core/store/actions";
import { environment } from "@env/environment";
import { ActivatedRoute } from "@angular/router";
import { DataStore } from "@app/core/store/app.store";
import * as _ from "lodash";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { state } from "@angular/animations";
import { DatePipe } from "@angular/common";

enum InfoType {
  amount = 1,
  info = 2
}

@Component({
  selector: "koppr-pot",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.scss"]
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  tabs = ["Personal Details"];
  validateForm: FormGroup;
  validateFormSection2: FormGroup;
  ValidateUpdateDetails: FormGroup;
  _employeeid: string = "";
  selectedKYCType: string = "MIN_KYC";
  _id: string = "";
  date: any = null;
  selectedIDType: string = "PASSPORT";
  initialState: any = "";
  subscribers: any;
  selectedPrefixValue: string = "+91";
  tabIndex: number = 0;

  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    { label: "Employee", value: "employee", checked: false },
    { label: "Company Admin", value: "company", checked: false }
  ];

  constructor(
    private fb: FormBuilder,
    private er: EmployeeReducers,
    private modalReducer: ModalReducers,
    private activatedRoute: ActivatedRoute,
    private _dataStore: DataStore,
    private datePipe: DatePipe
  ) {
    const initialState = this._dataStore.dataStore$.getValue();
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get("employeeid")) {
      this._employeeid = this.activatedRoute.snapshot.paramMap.get(
        "employeeid"
      );
    }

    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this._id = this.activatedRoute.snapshot.paramMap.get("id");
    }
    this.setSection2Form();

    this.setForm({});
    this.setContactForm({});

    if (this._id != "") {
      //fetch employee
      this.er.cardReducer({
        type: FETCH_USER_GRAPHQL,
        payload: {
          employee_id: this._employeeid
        }
      });

      this.er.cardReducer({
        type: GET_EMPLOYEE,
        payload: {
          id: this._id
        }
      });
      //this.tabs.push("Contact Details", "Salary Details", "Employee KYC");
      this.tabs.push("Contact Details");
      this.tabs.push("KYC Details");
      this.tabs.push("Enviar Account Details");
      //this.tabs.push("Roles");

      //load in form control
      this.subscribers = this._dataStore.dataStore$.subscribe(res => {
        const editEmployeeDetails = _.get(
          res.editEmployee.details,
          "data.fetch_employee_data",
          null
        );
        if (editEmployeeDetails != null) {
          this.updateForm(editEmployeeDetails, this.ValidateUpdateDetails);
          this.clearEditEmployeeStore();
        }

        const singleEmployeeDetails = _.get(
          res.singleEmployee.details,
          "data",
          null
        );
        if (singleEmployeeDetails) {
          if (this.validateForm) {
            this.updateForm(singleEmployeeDetails, this.validateForm);

            /*Remove and fix */
            const gender = _.get(singleEmployeeDetails, "gender", "male");

            this.updateContactForm(gender);
            this.clearContactEmployeeStore();
          }
        }
      });
    }
  }

  log(value: string[]): void {
    console.log(value);
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  updateContactForm(gender: any): void {
    this.ValidateUpdateDetails.controls["title"].setValue(
      gender.toLowerCase() === "male"
        ? "Mr"
        : gender.toLowerCase() === "female"
        ? "Ms"
        : "Mx"
    );

    this.ValidateUpdateDetails.controls["gender"].setValue(
      gender.toLowerCase() === "male"
        ? "M"
        : gender.toLowerCase() === "female"
        ? "F"
        : "O"
    );
  }

  clearEditEmployeeStore(): void {
    const state = this._dataStore.dataStore$.getValue();
    this._dataStore.dataStore$.next({
      ...state,
      ...successCommonData,
      editEmployee: {
        details: {}
      }
    });
  }

  clearContactEmployeeStore(): void {
    const state = this._dataStore.dataStore$.getValue();
    this._dataStore.dataStore$.next({
      ...state,
      ...successCommonData,
      singleEmployee: {
        details: {}
      }
    });
  }

  setForm(data: any) {
    this.validateForm = this.fb.group({
      first_name: [null],
      last_name: [null],
      email: [null, [Validators.required, Validators.email]],
      mobile: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      phoneNumberPrefix: [this.selectedPrefixValue],
      // employeeNumber: [null],
      // department: [null],
      // joiningDate: [null],
      gender: [null]
      // dateOfBirth: [null]
    });
  }

  updateForm(data: any, form: any) {
    let fieldValue: any = "";
    for (const i in form.controls) {
      fieldValue = data[i];
      if (i == "special_date") {
        fieldValue = new Date(data[i]);
        if (fieldValue == "Invalid Date") {
          fieldValue = new Date();
        }
      }

      if (i == "mobile") {
        fieldValue = data[i].replace("+91", "");
      }

      form.controls[i].setValue(fieldValue);
    }

    if (form.controls["phoneNumberPrefix"])
      form.controls["phoneNumberPrefix"].setValue("+91");
  }

  setContactForm(data?: any): void {
    const dataFormValues = _.get(data, "data.fetch_employee_data", {});

    this.ValidateUpdateDetails = this.fb.group({
      kit_no: [null, []],
      last_digits: [null, []],
      special_date: [null],
      address_1: [null],
      address_2: [null],
      city: [null],
      state: [null],
      pincode: [null],
      id_type: [null],
      id_number: [null],
      gender: [null, []],
      employee_id: [
        this._employeeid ? this._employeeid : "",
        [Validators.required]
      ],
      title: [null],
      country: ["India"],
      country_of_issue: ["IND"],
      kyc_status: ["MIN_KYC"]
    });
  }

  setSection2Form(): void {
    this.validateFormSection2 = this.fb.group({
      officeNumberOrBuildingName: [null],
      streetOrAreaName: [null],
      pincode: [null],
      costToCompany: [null],
      monthlySalary: [null],
      tdsPercentage: [null],
      professionalTax: [null],
      inHandSalary: [null],
      pan: [null],
      aadhaar: [null]
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      if (this._id) {
      } else {
        this.er.cardReducer({
          type: EMPLOYEE_CREATE,
          payload: {
            first_name: this.validateForm.controls["first_name"].value,
            last_name: this.validateForm.controls["last_name"].value,
            gender: this.validateForm.controls["gender"].value,
            email: this.validateForm.controls["email"].value,
            mobile: "91" + this.validateForm.controls["mobile"].value,
            company: this.initialState.company_id,
            isVerified: false,
            isCompanyAdmin: false
          }
        });
      }
    }
  }

  submitContactForm(): void {
    for (const i in this.ValidateUpdateDetails.controls) {
      this.ValidateUpdateDetails.controls[i].markAsDirty();
      this.ValidateUpdateDetails.controls[i].updateValueAndValidity();
    }

    let dateInFormat = this.datePipe.transform(this.date, "yyyy-MM-dd");
    if (dateInFormat == null) {
      dateInFormat = "";
    }

    if (this.ValidateUpdateDetails.valid) {
      this.er.cardReducer({
        type: CREATE_EMPLOYEE_CONTACT,
        payload: {
          name:
            this.validateForm.controls["first_name"].value +
            " " +
            this.validateForm.controls["last_name"].value,
          employee_id: this._employeeid,
          special_date: dateInFormat,
          address_1: this.ValidateUpdateDetails.controls["address_1"].value
            ? this.ValidateUpdateDetails.controls["address_1"].value
            : "",
          address_2: this.ValidateUpdateDetails.controls["address_2"].value
            ? this.ValidateUpdateDetails.controls["address_2"].value
            : "",
          city: this.ValidateUpdateDetails.controls["city"].value
            ? this.ValidateUpdateDetails.controls["city"].value
            : "",
          state: this.ValidateUpdateDetails.controls["state"].value
            ? this.ValidateUpdateDetails.controls["state"].value
            : "",
          pincode: this.ValidateUpdateDetails.controls["pincode"].value
            ? this.ValidateUpdateDetails.controls["pincode"].value
            : "",
          id_number: this.ValidateUpdateDetails.controls["id_number"].value
            ? this.ValidateUpdateDetails.controls["id_number"].value
            : "",
          id_type: this.ValidateUpdateDetails.controls["id_type"].value
            ? this.ValidateUpdateDetails.controls["id_type"].value
            : "",
          gender:
            this.validateForm.controls["gender"].value === "male"
              ? "M"
              : this.validateForm.controls["gender"].value === "female"
              ? "F"
              : "O",
          title:
            this.validateForm.controls["gender"].value === "male"
              ? "Mr"
              : this.validateForm.controls["gender"].value === "female"
              ? "Ms"
              : "Mx",
          kit_no: this.ValidateUpdateDetails.controls["kit_no"].value
            ? this.ValidateUpdateDetails.controls["kit_no"].value
            : "",
          last_digits: this.ValidateUpdateDetails.controls["last_digits"].value
            ? this.ValidateUpdateDetails.controls["last_digits"].value
            : "",
          country: "India",
          country_of_issue: "IND",
          kyc_status: "MIN_KYC"
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  goToTab(tab: number): void {
    this.tabIndex = tab;
  }

  ngOnDestroy() {
    if (this._id != "") {
      this.subscribers.unsubscribe();
    }
  }
}
