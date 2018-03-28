import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthApiService} from './api/auth.api.service';

@Injectable()
export class AuthService {

  static get ACCESS_TOKEN (): any {
    return `Bearer ${localStorage.getItem('token')}`;
  }

  constructor (private authApi: AuthApiService) {
  }

  public loginUser (loginData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postLogin(loginData).then(result => {
        localStorage.setItem('token', result['token']);
        localStorage.setItem('userId', result['id']);
        localStorage.setItem('role', result['roleName']);
        result['profile'].name ? localStorage.setItem('userName', result['profile'].name) : ()=>{};
        result['companyName'] ? localStorage.setItem('companyName', result['companyName']) : ()=>{};
        localStorage.setItem('avatar', environment.serverUrl + result['profile'].avatarUrl);
        resolve(result['token']);
      }, error => {
        reject(error);
      });
    });
  }

  public forgotPassword (forgotPasswordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postForgotPassword(forgotPasswordData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  public resetPassword (passwordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postResetPassword(passwordData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public checkoutResetPassword(token: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authApi.postCheckoutResetPassword(token).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public submitResetPassword (passwordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postSubmitResetPassword(passwordData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public logoutUser (): void {
    localStorage.clear();
  }

}
