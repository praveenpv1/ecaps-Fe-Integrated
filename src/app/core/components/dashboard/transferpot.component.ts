import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { AuthService, User } from 'auth';

import { REGISTER_FORM } from './form-id';

import { DialogService } from 'koppr-components';

import { LoggerService } from 'utils';

import {
  DynamicFormModel,
  DynamicCheckboxModel,
  DynamicInputModel,
  DynamicRadioGroupModel
} from "@ng-dynamic-forms/core";
import {  DynamicFormService } from "@ng-dynamic-forms/core";


export const MY_FORM_MODEL: DynamicFormModel = [

  new DynamicInputModel({
      id: "name",
      inputType: "select",
      label: "What would you like to call your pot?",
      maxLength: 100,
      placeholder: "Here you goes...",
      validators: {
        required: null,
        minLength: 3
    }
  }),

  // new DynamicRadioGroupModel<string>({

  //     id: "sampleRadioGroup",
  //     label: "Sample Radio Group",
  //     options: [
  //         {
  //             label: "Option 1",
  //             value: "option-1",
  //         },
  //         {
  //             label: "Option 2",
  //             value: "option-2"
  //         },
  //         {
  //             label: "Option 3",
  //             value: "option-3"
  //         }
  //     ],
  //     value: "option-3"
  // }),

  
];

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  category: string;
  route: string;
}

@Component({
  selector: 'koppr-transfer-component',
  templateUrl: './transferpot.component.html',
  styleUrls: ['./transferpot.component.scss']
})
export class TransferPotComponent  implements OnInit, OnDestroy {


  private returnUrl: string;
  formModel: DynamicFormModel = MY_FORM_MODEL;
  formGroup: FormGroup;


  tiles: Tile[] = [
    {text: 'Four', cols: 1, rows: 1, color: '#f4f4f4', category: '+', route: ''}
  ];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('RegisterComponent: ngOnInit()');

      //this.createForm();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.formGroup = this.dynamicFormService.createFormGroup(this.formModel);

  }

  async createForm() {

   
  }

  public ngOnDestroy() {
    this.logger.info('RegisterComponent: ngOnDestroy()');
  }

  //
  // Misc
  //

  public isValid() {

    let valid = true;

    if (this.formGroup) {
      valid = this.formGroup.valid;
    }

    return valid;
  }

  //
  // Command events
  //

  public onSubmit() {

    // <dynamic-form (keyup.enter)="onSubmit()" ... >
    this.router.navigate(['/goal']);
    return;
    if (this.isValid()) {


      
      const user: User = new User(
        this.formGroup.controls['file'].value,
        this.formGroup.controls['potname'].value
      );

      this.authService.createUserWithEmailAndPassword(user).catch(error => {

        let message = error.message;

        if (error.details) {
          message = error.details.message;
        }

        this.dialogService.openAlert({
          title: 'Alert',
          message: message,
          closeButton: 'CLOSE'
        });

      });
    }

  }

}
