import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ILoginData, IEmail} from '../shared/models/auth.model';
import {AuthApiService} from './api/auth.api.service';
import {UserApiService} from './api/user.api.service';

@Injectable()
export class AuthService {

  static get CUSTOMER (): any {
    return JSON.parse(localStorage.getItem('user_data'));
  }

  static get BASIC_TOKEN (): any {
    return environment.basicToken;
  }

  static get ACCESS_TOKEN (): any {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  static get REFRESH_TOKEN (): any {
    return localStorage.getItem('refresh_token');
  }

  constructor (private authApi: AuthApiService, private userApi: UserApiService) {
  }

  public loginUser (loginData: ILoginData): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postLogin(loginData).then(result => {
        localStorage.setItem('access_token', result['result'].data.bearerToken);
        localStorage.setItem('refresh_token', result['result'].data.refreshToken);
        this.userApi.getUserWithCustomerProfile().then(user => {
          localStorage.setItem('user_data', JSON.stringify(user['data']));
          resolve(result['result'].data.bearerToken);
        });

      }, error => {
        reject(error);
      });
    });
  }

  public forgotPassword (email: IEmail): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postForgotPassword(email).then(data => {
        resolve(data['data']);
      }, error => {
        reject(error);
      });
    });
  }

  public logoutUser (): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'https://lingvanex.com/en/platform';
  }

  public refreshToken (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postRefreshToken(AuthService.REFRESH_TOKEN).then(data => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.setItem('access_token', data.bearerToken);
          localStorage.setItem('refresh_token', data.refreshToken);

          resolve(data.bearerToken);
        },
        error => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          reject(error);
        });
    });
  }

  public resetPassword (token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.getResetPassword(token).then(data => {
          resolve(data['link']);
        },
        error => {
          reject(error);
        });
    });
  }

  public setNewPassword (token: string, newPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postSetNewPassword(token, newPassword).then(data => {
        resolve(data['resultCode']);
      }, error => {
        reject(error);
      });
    });
  }
}
