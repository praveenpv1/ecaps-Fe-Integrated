import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'koppr-card',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  tabs = [
    "Users",
    "Manage Roles"
  ];
  constructor() { }

  ngOnInit() {
  }

}
