import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import {
  COMPANY_DEPOSIT,
  GET_COMPANY_MAIN_TXNS,
  SHOW_MODAL,
  APPROVE_COMPANY_TXNS,
  GET_COMPANY_TOP_UP_TXNS,
  FUND_LOAD,
} from "@app/core/store/actions";
import * as _ from "lodash";
import { DataStore } from "@app/core/store/app.store";
import { WindowRefService } from "@app/core/services/widow-ref.service";
import {
  catchCommonData,
  successCommonData,
} from "@app/core/store/commonstoredata";
import { ModalReducers } from "@app/core/store/reducers/modal.reducer";
import { isAdmin } from "@app/core/services/utils";
import { ActivatedRoute } from "@angular/router";
import { SalaryIn, getStatusText } from "@app/core/services/utils";
import { ChangeDetectorRef } from "@angular/core";
import { environment } from "@env/environment";
import { FundReducers } from "@app/core/store/reducers/fund.reducer";

@Component({
  selector: "app-wallet-top-up",
  templateUrl: "./wallet-top-up.component.html",
  styleUrls: ["./wallet-top-up.component.scss"],
})
export class WalletTopUpComponent implements OnInit, OnDestroy {
  tabs = ["Transfer Value", "Transfer By Number", "Request Value"];
  validateForm: FormGroup;
  validateOnlineForm: FormGroup;
  transferValueForm: FormGroup;

  selectedTransType = "neft";
  companyTranscations: any;
  initialState: any = "";
  transcationAddResponse: any;
  tabIndex: number = 0;
  subscribers: any = {};
  isAdminRole: any = {};
  company_id: any = "";
  constructor(
    private fb: FormBuilder,
    private cR: CompanyReducers,
    private ds: DataStore,
    private winRef: WindowRefService,
    private mR: ModalReducers,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private fundload: FundReducers
  ) {
    this.initialState = ds.dataStore$.getValue();
    this.isAdminRole = isAdmin(this.initialState.roles);

    this.company_id = this.initialState.company_id;

    if (this.route.snapshot.paramMap.get("employeeid")) {
      this.company_id = this.route.snapshot.paramMap.get("company_id");
    }

    this.subscribers = this.ds.dataStore$.subscribe((res) => {
      console.log(res);

      // if (_.get(res.topUpTranscations.details, "data", null)) {
      //   this.companyTranscations = res.topUpTranscations.details.data;
      //   this.clearCompanyTxnsStore();
      // }

      // if (_.get(res.transcationAddResponse.details, "data", null)) {
      //   this.transcationAddResponse = res.transcationAddResponse.details.data;
      //   this.clearTxnAddResponseStore();
      //   // this.getCompanyTransactions();
      //   this.goToTab(2);
      // }
    });
  }

  // goToTab(tab: number): void {
  //   this.tabIndex = tab;
  //   this.ref.detectChanges();
  // }

  ngOnInit() {
    this.validateForm = this.fb.group({
      amount: [null, [Validators.required]],
      transactionType: [null, [Validators.required]],
      transactionNo: [null, [Validators.required]],
    });

    this.validateOnlineForm = this.fb.group({
      onlineAmount: [null, [Validators.required]],
    });

    this.transferValueForm = this.fb.group({
      amount: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      ref: [null, [Validators.required]],
    });

    // this.getCompanyTransactions();
  }
  ngOnDestroy() {
    this.subscribers.unsubscribe();
  }
  // clearCompanyTxnsStore(): void {
  //   const state = this.ds.dataStore$.getValue();
  //   this.ds.dataStore$.next({
  //     ...state,
  //     ...successCommonData,
  //     topUpTranscations: {
  //       details: {},
  //     },
  //   });
  // }

  // clearTxnAddResponseStore(): void {
  //   const state = this.ds.dataStore$.getValue();
  //   this.ds.dataStore$.next({
  //     ...state,
  //     ...successCommonData,
  //     transcationAddResponse: {
  //       details: {},
  //     },
  //   });
  // }

  // createRzpayOrder(data) {
  //   console.log(data);
  //   // call api to create order_id
  //   this.payWithRazor(1000);
  // }

  // getStatusText(status: string): string {
  //   return getStatusText(status);
  // }

  // payWithRazor(val) {
  //   const state = this.ds.dataStore$.getValue();

  //   const options: any = {
  //     key: environment.razorKey,
  //     amount: this.validateOnlineForm.controls["onlineAmount"].value * 100, // amount should be in paise format to display Rs 1255 without decimal point
  //     currency: "INR",
  //     name: "Enviar", // company name or product name
  //     description: "Pay Enviar", // product description
  //     image: "assets/images/icons/koppr-logo.svg", // company logo or product image
  //     //order_id: "10000", // order_id created by you in backend
  //     modal: {
  //       // We should prevent closing of the form when esc key is pressed.
  //       escape: false,
  //     },
  //     theme: {
  //       color: "#27878e",
  //     },
  //     prefill: {
  //       name: state.userInfo.first_name,
  //       email: state.userInfo.email,
  //       contact: state.userInfo.mobile,
  //     },
  //     notes: {
  //       address: "note value",
  //     },
  //   };
  //   options.handler = (response, error) => {
  //     options.response = response;

  //     console.log(response);
  //     console.log(options);

  //     const state = this.ds.dataStore$.getValue();
  //     let payload = {
  //       amount: options.amount / 100,
  //       company: this.company_id,
  //       details: {
  //         transaction_id: response.razorpay_payment_id,
  //         type: "card",
  //       },
  //     };

  //     this.pushTransferFund(payload);

  //     // call your backend api to verify payment signature & capture transaction
  //   };
  //   options.modal.ondismiss = () => {
  //     // handle the case when user closes the form while transaction is in progress
  //     console.log("Transaction cancelled.");
  //   };
  //   const rzp = new this.winRef.nativeWindow.Razorpay(options);
  //   rzp.open();
  // }

  submitForm(): void {
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }
    // if (this.validateForm.valid) {
    //   const state = this.ds.dataStore$.getValue();
    //   let payload = {
    //     amount: this.validateForm.controls["amount"].value,
    //     company: this.company_id,
    //     details: {
    //       transaction_id: this.validateForm.controls["transactionNo"].value,
    //       type: this.validateForm.controls["transactionType"].value,
    //     },
    //   };
    //   this.pushTransferFund(payload);
    // }
  }

  submitOnlineForm(): void {
    console.log("INSIDE SUBMIT");

    for (const i in this.validateOnlineForm.controls) {
      this.validateOnlineForm.controls[i].markAsDirty();
      this.validateOnlineForm.controls[i].updateValueAndValidity();
    }
    if (this.validateOnlineForm.valid) {
      //   this.createRzpayOrder({});
      const store = this.ds.dataStore$.getValue();

      this.fundload.fundReducer({
        type: FUND_LOAD,
        payload: {
          uid: store.userInfo._id,
          request_amount: this.validateOnlineForm.controls["onlineAmount"]
            .value,
          support_ref: "",
          support_uploads: "",
        },
      });
      this.validateOnlineForm.reset();
    }
  }

  submitTransferValueForm(): void {
    for (const i in this.transferValueForm.controls) {
      this.transferValueForm.controls[i].markAsDirty();
      this.transferValueForm.controls[i].updateValueAndValidity();
    }
    if (this.transferValueForm.valid) {
      //   this.createRzpayOrder({});
      const store = this.ds.dataStore$.getValue();

      this.fundload.fundReducer({
        type: FUND_LOAD,
        payload: {
          uid: store.userInfo._id,
          request_amount: this.transferValueForm.controls["amount"].value,
          support_ref: this.transferValueForm.controls["ref"].value,
          support_uploads: "",
        },
      });
      this.transferValueForm.reset();
    }
  }

  pushTransferFund(payload: any): void {
    // this.mR.cardReducer({
    //   type: SHOW_MODAL,
    //   payload: {
    //     showModal: true,
    //     title: "Info",
    //     message: "Added sucessfully"
    //   }
    // });
    // this.cR.cardReducer({
    //   type: COMPANY_DEPOSIT,
    //   payload: payload
    // });
  }

  getCompanyTransactions() {
    // this.cR.cardReducer({
    //   type: GET_COMPANY_TOP_UP_TXNS,
    //   payload: { company: this.company_id }
    // });
  }

  approveTransaction(data: any): void {
    // this.cR.cardReducer({
    //   type: APPROVE_COMPANY_TXNS,
    //   payload: {
    //     txnid: data._id,
    //     approval_status: "approved"
    //   }
    // });
  }

  tabChange(tabNo: any): void {
    this.tabIndex = tabNo;
  }

  // updateConfirmValidator(): void {
  //   /** wait for refresh value */
  //   Promise.resolve().then(() =>
  //     this.validateForm.controls.checkPassword.updateValueAndValidity()
  //   );
  // }
}
