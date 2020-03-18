import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { UploadChangeParam } from "ng-zorro-antd/upload";
import * as XLSX from "xlsx";
import { DataStore } from "@app/core/store/app.store";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import { EMPLOYEE_CREATE, EMPLOYEE_CREATE_BULK } from "@app/core/store/actions";
import * as _ from "lodash";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { StringMap } from "@angular/compiler/src/compiler_facade_interface";
import { BrowserStack } from "protractor/built/driverProviders";

@Component({
  selector: "koppr-pot",
  templateUrl: "./bulk-upload.component.html",
  styleUrls: ["./bulk-upload.component.scss"]
})
export class BulkUploadComponent implements OnInit {
  willDownload = false;
  jsonData = null;
  success: any;
  error: any;
  emailSuccessText: any = "";
  emailFailureText: any = "";

  constructor(
    private msg: NzMessageService,
    private ds: DataStore,
    private eR: EmployeeReducers
  ) {
    this.clearBulkStore();
  }
  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (status !== "uploading") {
      console.log(file, fileList);
    }
    if (status === "done") {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === "error") {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  onFileChange(ev) {
    this.clearBulkStore();
    let workBook = null;
    this.error = [];
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = event => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      this.jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //const dataString = JSON.stringify(this.jsonData);
    };
    reader.readAsBinaryString(file);
  }

  importData(): void {
    if (this.jsonData.Sheet1) {
      let sheet = this.jsonData.Sheet1;
      console.log(sheet);

      this.eR.cardReducer({
        type: EMPLOYEE_CREATE_BULK,
        payload: sheet
      });
    }
  }
  ngOnInit() {
    this.ds.dataStore$.subscribe(res => {
      this.success = [];
      this.error = [];

      if (_.get(res.bulkImport.details, "success", null)) {
        this.success = res.bulkImport.details.success;

        this.success.forEach(element => {
          this.emailSuccessText = this.emailSuccessText + element.email + ",";
        });

        //this.clearBulkStore();
      }

      if (_.get(res.bulkImport.details, "error", null)) {
        this.error = res.bulkImport.details.error;

        this.error.forEach(element => {
          this.emailFailureText =
            this.emailFailureText +
            element.email +
            ", Details - " +
            this.parseError(element.details);
        });
        //this.clearBulkStore();
      }
    });
  }

  parseError(error: string): string {
    let errorMEssage = error;

    if (error.indexOf("email_1") != -1) {
      errorMEssage = "Duplicate email.";
    } else if (error.indexOf("username_1") != -1) {
      errorMEssage = "Duplicate username.";
    } else if (error.indexOf("mobile_1") != -1) {
      errorMEssage = "Duplicate phone.";
    } else if (error.indexOf("valid") != -1) {
      errorMEssage = "Not valid email / phone";
    }

    return errorMEssage;
  }

  clearBulkStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      bulkImport: {
        details: {}
      }
    });
  }
}
