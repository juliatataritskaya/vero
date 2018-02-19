import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends ReactiveFormsBaseClass implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor (private authService: AuthService, private router: Router, private fb: FormBuilder) {
    super({
      email: ''
    }, {
      email: {
        required: 'Email is required.',
        minlength: 'Email must contain at least 5 symbols.',
        email: 'Email must be valid.'
      }
    });
  }

  ngOnInit () {
    this.createForgotPasswordForm();
  }

  public onForgotPasswordHandler(): void {
    if (!this.forgotPasswordForm.valid) {
      this.showError('Email is invalid, please check it.');
      return;
    }
    const formObject = this.forgotPasswordForm.value;
    const forgotPasswordData = new FormData();
    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
        forgotPasswordData.append(key, formObject[key]);
     }
    }
    this.authService.resetPassword(forgotPasswordData).then(() => {
      alert('Message was sent to the email');
      this.router.navigate(['/auth/login']);
    }, error => {
      alert(error.error.error);
    });
  }

  private createForgotPasswordForm (): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.email]]
    });

    this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(this.forgotPasswordForm, data));

    this.onValueChanged(this.forgotPasswordForm);
  }
}
