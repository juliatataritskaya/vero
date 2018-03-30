import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';
import {validateConfirmPassword} from '../../shared/validators/confirm-password.validator';
import {RedirectService} from '../../services/redirect.service';

declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends ReactiveFormsBaseClass implements OnInit {
  forgotPasswordForm: FormGroup;
  token: string;
  infoMessage: string;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
              private route: ActivatedRoute, private redirectService: RedirectService) {
    super({
      password: '',
      confirmPassword: ''
    }, {
      password: {
        required: 'Password is required.',
        minlength: 'Password must contain at least 3 symbols.'
      },
      confirmPassword: {
        required: 'Confirm password is required.',
        invalidConfirmPassword: 'Confirm password is invalid.'
      }
    });
  }

  ngOnInit() {
    this.onCheckExpTime();
    this.createNewPasswordForm();
  }

  public onCheckExpTime() {
    this.token = this.route.snapshot.queryParamMap['params'].token;
    const tokenData = new FormData();
    tokenData.append('token', this.token);
    this.authService.checkoutResetPassword(tokenData).then((res) => {
      if (res.message === 'This token isn\'t valid') {
        this.infoMessage = 'This token isn\'t valid';
        $('#infoBoxWithRedirect').modal('show');
        // this.router.navigate(['/auth/login']);
      }
    }, error => {
      $('#infoBoxWithRedirect').modal('show');
      this.infoMessage = 'Something wrong, please try again.';
      // this.router.navigate(['/auth/login']);
    });
  }

  public onSendHandler(): void {
    $('#infoBox').modal('show');
    if (!this.forgotPasswordForm.valid) {
      this.infoMessage = 'Password is invalid, please check it.';
      return;
    }
    const passwordData = new FormData();
    passwordData.append('token', this.token);
    passwordData.append('password', this.forgotPasswordForm.get('password').value);
    this.authService.submitResetPassword(passwordData).then(() => {
      this.infoMessage = 'Password was changed';
    }, error => {
      if ('No token or password was sent.' === error.error.error) {
        this.infoMessage = error.error.error;
        return;
      } else {
        this.redirectService.checkRedirect(error.status, (message) => {
          if (message) {
            this.infoMessage = error.error.error;
          }
        });
      }
      this.infoMessage = 'Something wrong, please try again.';
    });
  }

  public onCancelHandler(): void {
    this.router.navigate(['/auth/login']);
  }

  private createNewPasswordForm(): void {
    this.forgotPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: validateConfirmPassword});

    this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(this.forgotPasswordForm, data));

    this.onValueChanged(this.forgotPasswordForm);
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

  closeModalRedirect() {
    $('#infoBoxWithRedirect').modal('hide');
    this.infoMessage = null;
    this.router.navigate(['/auth/login']);
  }
}
