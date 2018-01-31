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
        console.log(result);
        localStorage.setItem('token', result['token']);
        localStorage.setItem('userId', result['id']);
        localStorage.setItem('role', result['roleName']);
        localStorage.setItem('userName', result['name']);
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

  public logoutUser (): void {
    localStorage.clear();
  }

}
