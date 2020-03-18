import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import {
  CREATE_COMPANY_SIGNUP,
  GET_TOKEN,
  GET_COMPANY_BY_ID,
  UPDATE_COMPANY
} from "@app/core/store/actions";
import { DataStore } from "@app/core/store/app.store";
import { AuthService } from "auth";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";

@Component({
  selector: "sign-up-inner-company",
  templateUrl: "./sign-up-inner.component.html",
  styleUrls: ["./sign-up-inner.component.scss"]
})
export class SignUpInnerComponent implements OnInit {
  firstStep = true;
  selectedValue: string = "male";
  validateForm: FormGroup;
  selectedPrefixValue: string = "+91";
  company_id: string = "";
  constructor(
    private fb: FormBuilder,
    private cR: CompanyReducers,
    private dataStore: DataStore,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get("company_id")) {
      this.company_id = this.activatedRoute.snapshot.paramMap.get("company_id");
    } else if (
      sessionStorage.getItem("company_id") &&
      sessionStorage.getItem("company_id") != ""
    ) {
      this.company_id = sessionStorage.getItem("company_id");
    }

    if (this.company_id != "") {
      this.editForm();
      this.cR.cardReducer({
        type: GET_COMPANY_BY_ID,
        payload: {
          company_id: this.company_id
        }
      });
    } else {
      this.setForm();

      //if out side company admin
      this.authService.setAccessToken(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uIjoiNWU0MGY1Y2Y3YzIyOGI1MGRmNzg5YjdlIiwiaWF0IjoxNTgxMzE1NTM1LCJleHAiOjE1ODM5MDc1MzV9.cTlV6rFqJYK92RzlA_5rFC0H21OgiuYLyBa8OBpnykAD518PDiF-oNOC31IqlJp2ugJ6JJe-9umnrTBWvn2t3z_wO32lPspe7z0GpoNlnhTwVxJ05wkRTY-UPTR0XedWdPc3D6TlTfZV9RftFDZ-9quWOuqn_fiwWaztT6RDKjHK34HPjeFGT5dcHMioL99tpT-aL_ahI22OovRCBfDlKC0wsq_m8K6jkw28QoxrXqkb8WU5l3FVSMk0hPraOu19FwfZv30s95gpPOz15ZZoxIiwBo5KeiUTvqXY2mdMi3JeVMBdT3071gljgTHenMX7Phuf0ENVBL398GmXoFBLLQ"
      );

      //this.getToken();
    }

    this.dataStore.dataStore$.subscribe(res => {
      const companyDetails = _.get(res.company_info.details, "data", null);
      if (companyDetails != null) {
        this.updateForm(companyDetails, this.validateForm);
        this.clearCompanyStore();
      }
    });
  }

  setForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [
        null,

        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phoneNumberPrefix: [this.selectedPrefixValue],

      CIN: [null, []],
      PAN: [null, []],
      GSTIN: [null, []],
      NoofEmployees: [null, []]
    });
  }

  editForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null],
      mobile: [null],
      first_name: [null],
      last_name: [null],
      gender: [null],
      phoneNumberPrefix: [this.selectedPrefixValue],

      CIN: [null, []],
      PAN: [null, []],
      GSTIN: [null, []],
      NoofEmployees: [null, []],
      head_office_address: [null]
    });
  }

  updateForm(data: any, form: any) {
    let fieldValue: any = "";
    for (const i in form.controls) {
      fieldValue = data[i];

      if (i == "mobile") {
        fieldValue = data[i].replace("+91", "");
      }

      if (i == "head_office_address") {
        if (data[i]) {
          fieldValue = data[i].address;
        } else {
          fieldValue = "";
        }
      }

      form.controls[i].setValue(fieldValue);
    }

    if (form.controls["phoneNumberPrefix"])
      form.controls["phoneNumberPrefix"].setValue("+91");
  }

  clearCompanyStore(): void {
    const state = this.dataStore.dataStore$.getValue();
    this.dataStore.dataStore$.next({
      ...state,
      ...successCommonData,
      company_info: {
        details: {}
      }
    });
  }

  getToken(): void {
    this.cR.cardReducer({
      type: GET_TOKEN,
      payload: { token: "" }
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (!this.validateForm.valid) {
      if (
        !this.validateForm.controls["name"].valid ||
        !this.validateForm.controls["first_name"].value ||
        !this.validateForm.controls["last_name"].value ||
        !this.validateForm.controls["mobile"].value ||
        !this.validateForm.controls["email"].value ||
        !this.validateForm.controls["gender"].value
      ) {
        this.firstStep = true;
      }
    }

    if (this.validateForm.valid) {
      if (this.company_id != "") {
        this.cR.cardReducer({
          type: UPDATE_COMPANY,
          payload: {
            name: this.validateForm.controls["name"].value,
            contact_name:
              this.validateForm.controls["first_name"].value +
              " " +
              this.validateForm.controls["last_name"].value,
            first_name: this.validateForm.controls["first_name"].value,
            last_name: this.validateForm.controls["last_name"].value,
            mobile:
              this.validateForm.controls["phoneNumberPrefix"].value +
              this.validateForm.controls["mobile"].value,
            email: this.validateForm.controls["email"].value,
            gender: this.validateForm.controls["gender"].value,

            CIN: this.validateForm.controls["CIN"].value,
            PAN: this.validateForm.controls["PAN"].value,
            GSTIN: this.validateForm.controls["GSTIN"].value,
            NoofEmployees: this.validateForm.controls["NoofEmployees"].value,

            routerLink: ["/", "signin", "verify"],
            routerType: "redirect",
            company_id: this.company_id,
            head_office_address: {
              address: this.validateForm.controls["head_office_address"].value
            }
          }
        });
      } else {
        this.cR.cardReducer({
          type: CREATE_COMPANY_SIGNUP,
          payload: {
            name: this.validateForm.controls["name"].value,
            contact_name:
              this.validateForm.controls["first_name"].value +
              " " +
              this.validateForm.controls["last_name"].value,
            first_name: this.validateForm.controls["first_name"].value,
            last_name: this.validateForm.controls["last_name"].value,
            mobile:
              this.validateForm.controls["phoneNumberPrefix"].value +
              this.validateForm.controls["mobile"].value,
            email: this.validateForm.controls["email"].value,
            gender: this.validateForm.controls["gender"].value,

            CIN: this.validateForm.controls["CIN"].value,
            PAN: this.validateForm.controls["PAN"].value,
            GSTIN: this.validateForm.controls["GSTIN"].value,
            NoofEmployees: this.validateForm.controls["NoofEmployees"].value,
            routerLink: ["/", "signin", "verify"],
            routerType: "redirect"
          }
        });
      }
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  nextCompanySignup(): void {
    this.firstStep = !this.firstStep;
  }
}
