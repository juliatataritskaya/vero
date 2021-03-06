import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';
import {RedirectService} from '../../services/redirect.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends ReactiveFormsBaseClass implements OnInit {
  forgotPasswordForm: FormGroup;
  infoMessage: string;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
              private redirectService: RedirectService) {
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

  ngOnInit() {
    this.createForgotPasswordForm();
  }

  public onForgotPasswordHandler(): void {
    $('#infoBox').modal('show');
    if (!this.forgotPasswordForm.valid) {
      this.infoMessage = 'Email is invalid, please check it.';
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
      this.infoMessage = 'Message was sent to the email';
    }, error => {
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = error.error.error;
        }
      });
    });
  }

  private createForgotPasswordForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.email]]
    });

    this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(this.forgotPasswordForm, data));

    this.onValueChanged(this.forgotPasswordForm);
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }
}
