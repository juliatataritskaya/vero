import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {RedirectService} from "../../../../services/redirect.service";

@Component({
  selector: 'app-companies-tab',
  templateUrl: './companies-tab.component.html',
  styleUrls: ['./companies-tab.component.css']
})
export class CompaniesTabComponent extends ReactiveFormsBaseClass implements OnInit {
  companySettingsForm: FormGroup;
  constructor(private el: ElementRef, private fb: FormBuilder,
              private redirectService: RedirectService) {
    super({
      name: '',
      address: '',
      email: '',
      phone: '',
      contactName: '',
    }, {
      name: {
        required: 'Name is required.'
      },
      address: {
        required: 'Address is required.'
      },
      email: {
        required: 'Email is required.',
        email: 'Email isn\'t valid'
      },
      phone: {
        required: 'Phone is required.'
      },
      contactName: {
        required: 'Contact name is required.'
      }
    });
  }

  ngOnInit () {
    this.createProjectForm();
  }

  public onSaveHandler(): void {
    if (!this.companySettingsForm.valid) {
      this.showError('Company\'s data is invalid, please check it.');
      return;
    }
    const formObject = this.companySettingsForm.value;
    const companyData = new FormData();
    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        companyData.append(key, formObject[key]);
      }
    }
    console.log(formObject);
  }

  private createProjectForm(): void {
    this.companySettingsForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', []],
      contactName: ['', [Validators.required]]
    });

    this.companySettingsForm.valueChanges.subscribe(data => this.onValueChanged(this.companySettingsForm, data));

    this.onValueChanged(this.companySettingsForm);
  }


}
