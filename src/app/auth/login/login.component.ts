import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends ReactiveFormsBaseClass implements OnInit {
  loginForm: FormGroup;
  email: string;
  password: string;

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
    this.createLoginForm();
  }

  public onLoginHandler(email, password): void {
    if (!this.loginForm.valid) {
      this.showError('Login data in invalid, please check it.');
      return;
    }
    this.router.navigate(['/main']);
    const loginData = this.loginForm.value;
    this.authService.loginUser(loginData).then(() => {
      this.router.navigate(['/main']);
    }, error => {
      alert('Something wrong, please try again.');
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
