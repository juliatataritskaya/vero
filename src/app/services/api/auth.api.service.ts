import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ILoginData, ILoginSuccessResponse, IEmail} from '../../shared/models/auth.model';
import {INewUser, IUser} from '../../shared/models/user.model';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class AuthApiService extends BaseHttpService {
  private static loginUrl = environment.serverUrl + '/api/login';
  private static forgotPasswordUrl = environment.serverUrl + '/api/forgotPassword';

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

}
