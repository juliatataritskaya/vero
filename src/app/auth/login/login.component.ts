import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsBaseClass} from '../../shared/classes/reactive-forms.base.class';
import {RedirectService} from '../../services/redirect.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends ReactiveFormsBaseClass implements OnInit {
  loginForm: FormGroup;
  infoMessage: string;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
              private redirectService: RedirectService) {
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

  ngOnInit() {
    this.createLoginForm();
  }

  public onLoginHandler(): void {
    if (!this.loginForm.valid) {
      this.infoMessage = 'Login data is invalid, please check it.';
      $('#infoBox').modal('show');
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
      this.redirectService.checkRedirect(error.status, (message) => {
        if (message) {
          this.infoMessage = error.error.error;
          $('#infoBox').modal('show');
        }
      });
    });
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(this.loginForm, data));

    this.onValueChanged(this.loginForm);
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }
}
