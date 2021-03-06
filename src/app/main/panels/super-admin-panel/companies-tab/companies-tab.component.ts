import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../../../shared/classes/reactive-forms.base.class';
import {RedirectService} from '../../../../services/redirect.service';
import {CompanyService} from '../../../../services/company.service';
import {validateConfirmPassword} from '../../../../shared/validators/confirm-password.validator';

declare var $: any;

@Component({
  selector: 'app-companies-tab',
  templateUrl: './companies-tab.component.html',
  styleUrls: ['./companies-tab.component.css']
})
export class CompaniesTabComponent extends ReactiveFormsBaseClass implements OnInit {
  companySettingsForm: FormGroup;
  securityForm: FormGroup;
  currentCompanySettings: any;
  infoMessage: string;

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
        required: 'Name is required.',
        pattern: 'The name can not contain only spaces or spaces at the beginning of the line'
      },
      address: {
        required: 'Address is required.'
      },
      email: {
        required: 'Email is required.',
        email: 'Email isn\'t valid'
      },
      phone: {
        required: 'Phone is required.',
        pattern: 'Phone number must be in the format +0123456789 or 89021234567'
      },
      contactName: {
        required: 'Contact name is required.',
        pattern: 'The name can not contain characters or numbers'
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
      this.onErrorHandle(error);
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
    this.securityForm.reset();
  }

  public onSaveHandler(): void {
    if (!this.companySettingsForm.valid || !this.securityForm.valid ) {
      this.infoMessage = 'Company\'s data is invalid, please check it.';
      $('#infoBox').modal('show');
    } else {
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
        this.infoMessage = 'Company settings were saved';
        $('#infoBox').modal('show');
        this.getCompanySettings(() => {
          this.setCompanySettingsData();
          result.profile.userName ? localStorage.setItem('userName', result.profile.userName)
            : localStorage.setItem('userName', result.profile.companyName);
          result.profile.companyName ? localStorage.setItem('companyName', result.profile.companyName)
            : localStorage.setItem('companyName', '');
        });
      }, (error) => {
        this.onErrorHandle(error);
      });
    }
  }

  private createCompanySettingsForm(): void {
    this.companySettingsForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('(?=\\S)[^\\\\]+')]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+]\\d+$|^\\d+$')]],
      password: ['', []],
      contactName: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я ]*')]]
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

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

  onErrorHandle(error) {
    this.redirectService.checkRedirect(error.status, (message) => {
      if (message) {
        this.infoMessage = (error.error.error == 'User with this email already registered in the system.'
          || error.error.error == 'Invalid email format.')
          ? error.error.error : message;
        $('#infoBox').modal('show');
      }
    });
  }
}
