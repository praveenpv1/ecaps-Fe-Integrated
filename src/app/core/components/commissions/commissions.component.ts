import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent implements OnInit {
  commissionsList = [
  {
    "type": "DTH",
    "operator": "Videocon",
    "slab": ""
  },
  {
    "type": "Prepaid Recharge",
    "operator": "Airtel",
    "slab": ""
  },
  {
    "type": "Electricity Bill",
    "operator": "BBPS",
    "slab": ""
  },
  {
    "type": "Postpaid Recharge",
    "operator": "Vodafone",
    "slab": ""
  }
]
  constructor() { }

  ngOnInit() {
  }

}
