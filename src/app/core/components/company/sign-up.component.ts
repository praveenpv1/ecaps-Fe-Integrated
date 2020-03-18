import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import { CREATE_COMPANY_SIGNUP, GET_TOKEN } from "@app/core/store/actions";
import { DataStore } from "@app/core/store/app.store";
import { AuthService } from "auth";

@Component({
  selector: "sign-up-company",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
