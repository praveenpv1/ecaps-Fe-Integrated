import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as _ from "lodash";
import { MarginReducers } from "@app/core/store/reducers/margin.reducer";
import { CREATE_NEW_MARGIN } from "@app/core/store/actions";

@Component({
  selector: "app-add-margins",
  templateUrl: "./add-margins.component.html",
  styleUrls: ["./add-margins.component.scss"],
})
export class AddMarginsComponent implements OnInit {
  validateForm: FormGroup;
  _id: string = "";
  marginTypeList: any;
  marginRoles: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private mR: MarginReducers
  ) {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this._id = this.activatedRoute.snapshot.paramMap.get("id");
    }
    this.marginTypeList = [
      { display: "Fund Transfer", value: "Fundtransfer" },
      { display: "Recharge", value: "Recharge" },
    ];
    this.marginRoles = [
      { display: "Super Distributor", value: "superdistributor" },
      { display: "Distributor", value: "distributor" },
      { display: "Retailer", value: "retailer" },
    ];
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    if (_.isEmpty(this._id)) {
      this.validateForm = this.fb.group({
        margin_type: [this.marginTypeList[0].value, [Validators.required]],
        margin_mode: ["1", [Validators.required]],
        margin_role: [this.marginRoles[0].value, [Validators.required]],
        margin_actual: [null, [Validators.required]],
      });
    }
  }

  submitForm() {
    console.log("form", this.validateForm.value);

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      if (_.isEmpty(this._id)) {
        this.mR.marginReducer({
          type: CREATE_NEW_MARGIN,
          payload: this.validateForm.value,
        });
      }
    }
  }
}
