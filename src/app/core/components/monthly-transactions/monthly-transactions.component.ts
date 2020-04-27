import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthly-transactions',
  templateUrl: './monthly-transactions.component.html',
  styleUrls: ['./monthly-transactions.component.scss']
})
export class MonthlyTransactionsComponent implements OnInit {
  searchText = "";

  constructor() { }

  ngOnInit() {
  }

}
