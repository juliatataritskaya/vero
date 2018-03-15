import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends ReactiveFormsBaseClass implements OnInit {
  loginForm: FormGroup;

  constructor (private authService: AuthService, private router: Router, private fb: FormBuilder) {
    super({
      email: '',
      password: '',
    }, {
      email: {
        required: 'Email is required.',
        minlength: 'Email must contain at least 5 symbols.',
        email: 'Email must be valid.'
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must contain at least 1 symbols.'
      }
    });
  }

  ngOnInit () {
    $('.modal').modal('hide');
    this.createLoginForm();
  }

  public onLoginHandler(): void {
    if (!this.loginForm.valid) {
      this.showError('Login data is invalid, please check it.');
      return;
    }
    const formObject = this.loginForm.value;
    const loginData = new FormData();
    for (const key in formObject) {
      if (formObject.hasOwnProperty(key)) {
       loginData.append(key, formObject[key]);
     }
    }
    this.authService.loginUser(loginData).then(() => {
      this.router.navigate(['/main']);
    }, error => {
      alert(error.error.error);
    });
  }

  private createLoginForm (): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(this.loginForm, data));

    this.onValueChanged(this.loginForm);
  }
}
