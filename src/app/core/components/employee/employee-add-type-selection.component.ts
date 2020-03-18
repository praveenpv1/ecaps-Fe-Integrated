import { Component, OnInit } from "@angular/core";
import { SalaryIn } from "@app/core/services/utils";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  category: string;
  route: string;
  icon: string;
}

interface SalaryPayment {
  paidOn: Date;
  amount: string;
  month: string;
  employeesPaid: number;
  paidBy: string;
  id: number;
}

enum InfoType {
  amount = 1,
  info = 2
}

interface InfoCards {
  title: string;
  text: string;
  icon: string;
  bg: string;
  desc: string;
  routerLink: any;
  type: InfoType;
}

@Component({
  selector: "koppr-pot",
  templateUrl: "./employee-add-type-selection.component.html",
  styleUrls: ["./employee-add-type-selection.component.scss"]
})
export class EmployeeAddTypeSelectionComponent implements OnInit {
  tabs = [
    "Personal Details",
    "Contact Details",
    "Salary Details",
    "Employee KYC"
  ];

  balanceCards: InfoCards[] = [
    {
      title: "Enviar Account Balance",
      text: "7,43,989.00",
      icon: "more",
      bg: "",
      desc: "TOP UP",
      routerLink: ["/", "company", "deposit"],
      type: InfoType.amount
    },
    {
      title: "Sales Disbursed",
      text: "7,43,989.00",
      icon: "more",
      bg: "",
      desc: "VIEW DETAILS",
      routerLink: "",
      type: InfoType.amount
    },
    {
      title: "Claims Settled",
      text: "7,43,989.00",
      icon: "more",
      bg: "",
      desc: "VIEW DETAILS",
      routerLink: "",
      type: InfoType.amount
    },
    {
      title: "Allowance Disbursed",
      text: "7,43,989.00",
      icon: "more",
      bg: "",
      desc: "VIEW DETAILS",
      routerLink: "",
      type: InfoType.amount
    }
  ];

  infoCards: InfoCards[] = [
    {
      title: "Next Salary Disbursement in",
      text: SalaryIn(),
      icon: "more",
      bg: "",
      desc: "VIEW DETAILS",
      routerLink: "",
      type: InfoType.info
    },
    {
      title: "Pending Claims",
      text: "7,43,989.00",
      icon: "more",
      bg: "",
      desc: "VIEW DETAILS",
      routerLink: "",
      type: InfoType.info
    }
  ];
  salaryPayment: SalaryPayment[] = [];
  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.salaryPayment.push({
        paidOn: new Date(),
        amount: "900000",
        month: "June 2010",
        employeesPaid: 37,
        paidBy: "Test user",
        id: i
      });
    }
  }
}
