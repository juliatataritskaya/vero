import {Injectable} from '@angular/core';
import {ILoginData, IEmail} from '../shared/models/auth.model';
import {AuthApiService} from './api/auth.api.service';

@Injectable()
export class AuthService {

  static get ACCESS_TOKEN (): any {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  constructor (private authApi: AuthApiService) {
  }

  public loginUser (loginData: ILoginData): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authApi.postLogin(loginData).then(result => {
        localStorage.setItem('token', result['data'].token);
      }, error => {
        reject(error);
      });
    });
  }

  public logoutUser (): void {
    localStorage.removeItem('token');
  }

}
