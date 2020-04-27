import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {  
  isVisible = false;
  isOkLoading = false;
  searchText = "";
  loyaltyValue = 'enviar';
  childLists = [
    {
      "margins": {
          "fund_transfer": 0,
          "bill_payment": 0,
          "recharge": 0
      },
      "company_name": "test company1",
      "dob": "20-09-1986",
      "is_verified": false,
      "status": true,
      "tpin": "",
      "aadhaar": "Test",
      "pan": "Test",
      "voter_id": "Test",
      "kit_number": "",
      "wallet_balance": 0,
      "_id": "5e2c4d430f1c7f27e0a8676b",
      "_pid": "5e20ad84f97c743b20df1389",
      "firstname": "shyam",
      "lastname": "prasad",
      "phone": "9292922",
      "username": "test",
      "email": "praveen.p@gmail.com",
      "role": "superdistributor",
      "created_by": "5e20ad84f97c743b20df1389",
      "created_at": "2020-01-25T14:14:27.835Z",
      "updated_at": "2020-01-26T09:18:12.003Z"
    },
    {
      "margins": {
          "fund_transfer": 0,
          "bill_payment": 0,
          "recharge": 0
      },
      "company_name": "test company2",
      "dob": "08-03-1994",
      "is_verified": true,
      "status": true,
      "tpin": "",
      "aadhaar": "yyreye",
      "pan": "ryryryr",
      "voter_id": "hhdhsd",
      "kit_number": "",
      "wallet_balance": 0,
      "_id": "5e2ddff4ef380f0a94fac675",
      "_pid": "5e20ad84f97c743b20df1389",
      "firstname": "shuhaib",
      "lastname": "ap",
      "phone": "38383838",
      "username": "test4",
      "email": "praveen.pv1@gmail.com",
      "role": "retailer",
      "created_by": "5e20ad84f97c743b20df1389",
      "created_at": "2020-01-26T18:52:36.028Z",
      "updated_at": "2020-03-30T01:03:17.142Z"}
  ];

  constructor() { }

  ngOnInit() {
  }


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
