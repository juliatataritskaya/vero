import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {RedirectService} from '../../../../services/redirect.service';
import {CompanyService} from '../../../../services/company.service';
import {validateConfirmPassword} from '../../../../shared/validators/confirm-password.validator';

@Component({
  selector: 'app-companies-tab',
  templateUrl: './companies-tab.component.html',
  styleUrls: ['./companies-tab.component.css']
})
export class CompaniesTabComponent extends ReactiveFormsBaseClass implements OnInit {
  companySettingsForm: FormGroup;
  securityForm: FormGroup;
  currentCompanySettings: any;

  constructor(private el: ElementRef, private fb: FormBuilder,
              private redirectService: RedirectService, private companyService: CompanyService) {
    super({
      name: '',
      address: '',
      email: '',
      phone: '',
      contactName: '',
      password: '',
      confirmPassword: ''
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
      },
      password: {
        uninvited: 'Enter new password',
      },
      confirmPassword: {
        invalidConfirmPassword: 'Confirm password is invalid.'
      },
    });
  }

  ngOnInit() {
    this.createCompanySettingsForm();
    this.getCompanySettings(() => {
      this.setCompanySettingsData();
    });
  }

  private getCompanySettings(callback) {
    this.companyService.getCompanySettings().then((result) => {
      this.currentCompanySettings = result['profile'];
      callback();
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      } else {
        alert('Something wrong, please try again.');
      }
    });
  }

  private setCompanySettingsData() {
    this.companySettingsForm.patchValue({
      name: this.currentCompanySettings.companyName,
      address: this.currentCompanySettings.companyAddress,
      email: this.currentCompanySettings.email,
      phone: this.currentCompanySettings.contactPhone,
      contactName: this.currentCompanySettings.contactName,
    });
    this.securityForm.patchValue({
      password: '',
      confirmPassword: ''
    });
  }

  public onSaveHandler(): void {
    if (!this.companySettingsForm.valid || !this.securityForm.valid ) {
      this.showError('Company\'s data is invalid, please check it.');
      return;
    }
    const companyObject = this.companySettingsForm.value;
    let companyData =  { profile: {
        companyName: companyObject.name,
        companyAddress: companyObject.address,
        email: companyObject.email,
        contactName: companyObject.contactName,
        contactPhone: companyObject.phone
      },
      error: ''
    };
    if (this.securityForm.value['password']) {
      companyData.profile['password'] = this.securityForm.value['password'];
    }
    this.companyService.updateCompanySettings(companyData).then((result) => {
      alert('Company settings was saved');
      this.getCompanySettings(() => {
        this.setCompanySettingsData();
      });
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      } else {
        alert('Something wrong, please try again.');
      }
    });
  }

  private createCompanySettingsForm(): void {
    this.companySettingsForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', []],
      contactName: ['', [Validators.required]]
    });

    this.securityForm = this.fb.group({
      password: [ '', []],
      confirmPassword: ['', []]
    }, {validator: validateConfirmPassword});

    this.companySettingsForm.valueChanges.subscribe(data => this.onValueChanged(this.companySettingsForm, data));
    this.securityForm.valueChanges.subscribe(data => this.onValueChanged(this.securityForm, data));
    this.onValueChanged(this.securityForm);
    this.onValueChanged(this.companySettingsForm);
  }

  onCancel() {
    this.setCompanySettingsData();
  }
}
