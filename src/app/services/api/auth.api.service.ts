import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ILoginSuccessResponse} from '../../shared/models/auth.model';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class AuthApiService extends BaseHttpService {
  private static loginUrl = environment.serverUrl + '/api/login';
  private static forgotPasswordUrl = environment.serverUrl + '/api/forgotPassword';
  private static resetPasswordUrl = environment.serverUrl + '/api/ResetPassword';
  private static checkoutResetPasswordUrl = environment.serverUrl + '/api/CheckoutResetPassword';
  private static submitResetPasswordUrl = environment.serverUrl + '/api/SubmitResetPassword';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public postLogin (loginData: any): Promise<ILoginSuccessResponse> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.loginUrl, {}, loginData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postForgotPassword (forgotPasswordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.forgotPasswordUrl, {}, forgotPasswordData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postResetPassword (passwordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.resetPasswordUrl, {}, passwordData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postCheckoutResetPassword (token: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.checkoutResetPasswordUrl, {}, token)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postSubmitResetPassword (passwordData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.post(AuthApiService.submitResetPasswordUrl, {}, passwordData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
