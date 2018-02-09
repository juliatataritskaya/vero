import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {UserApiService} from './api/user.api.service';

@Injectable()
export class UserService {

  constructor (private userApi: UserApiService) {
  }

  public getAllUser (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.getAllUsers().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteUser (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.deleteUser(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public createUser (userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.postUser(userData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
