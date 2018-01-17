import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ILoginData, ILoginSuccessResponse, IEmail} from '../../shared/models/auth.model';
import {INewUser, IUser} from '../../shared/models/user.model';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class AuthApiService extends BaseHttpService {
  private static registrationUrl = environment.serverUrl + '/api/auth/registration';
  private static tokenUrl = environment.serverUrl + '/api/auth/login';
  private static refreshTokenUrl = environment.serverUrl + '/api/auth/refresh';
  private static forgotPasswordUrl = environment.serverUrl + '/api/auth/password/forgot';
  private static resetPasswordUrl = environment.serverUrl + '/api/auth/password/forgot/reset';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public postRegistration (userData: INewUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.registrationUrl, {}, userData)
        .subscribe(result => {
          const user = Object.assign(userData, {id: result.data.id});
          resolve(user);
        }, error => {
          reject(error);
        });
    });
  }

  public postLogin (loginData: ILoginData): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.tokenUrl, {}, loginData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }


  public postRefreshToken (refreshToken: string): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      if (!refreshToken) {
        reject(new Error('No refresh token.'));
        return;
      }
      this.post(AuthApiService.refreshTokenUrl, {}, {refreshToken})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getResetPassword (token: string): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token.'));
        return;
      }
      this.get(AuthApiService.resetPasswordUrl, {token})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postForgotPassword (email: IEmail): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.forgotPasswordUrl, {}, {email})
        .subscribe(result => {
          resolve(result);
          }, error => {
          reject(error);
        });
    });
  }

  public postSetNewPassword (token: string, password: string): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.resetPasswordUrl, {token}, {password})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
