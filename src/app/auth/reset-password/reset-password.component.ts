import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';
import {validateConfirmPassword} from '../../shared/validators/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends ReactiveFormsBaseClass implements OnInit {
  forgotPasswordForm: FormGroup;
  token: string;

  constructor (private authService: AuthService, private router: Router, private fb: FormBuilder,
               private route: ActivatedRoute) {
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

  ngOnInit () {
    this.onCheckExpTime();
    this.createNewPasswordForm();
  }

  public onCheckExpTime() {
    this.token = this.route.snapshot.queryParamMap['params'].token;
    const tokenData = new FormData();
    tokenData.append('token', this.token);
    this.authService.checkoutResetPassword(tokenData).then((res) => {
      console.log(res);
    }, error => {
      alert('Something wrong, please try again.');
      this.router.navigate(['/auth/login']);
    });
  }

  public onSendHandler (): void {
    if (!this.forgotPasswordForm.valid) {
     alert('Password is invalid, please check it.');
      return;
    }
    const passwordData = new FormData();
    passwordData.set('token', this.token);
    passwordData.set('password', this.forgotPasswordForm.get('password').value);
    console.log(this.forgotPasswordForm.get('password').value);
    console.log(this.token);
    console.log(passwordData);
    this.authService.submitResetPassword(passwordData).then(() => {
      alert('Password was changed');
      this.router.navigate(['/auth/login']);
    }, error => {
      if ('No token or password was sent.' == error.error.error) {
        alert(error.error.error);
        return;
      }
      alert('Something wrong, please try again.');
    });
  }

  public onCancelHandler(): void {
    this.router.navigate(['/auth/login']);
  }

  private createNewPasswordForm (): void {
    this.forgotPasswordForm = this.fb.group({
      password: [ '', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: validateConfirmPassword});

    this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(this.forgotPasswordForm, data));

    this.onValueChanged(this.forgotPasswordForm);
  }
}
