import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class UserApiService extends BaseHttpService {
  private static getAllUsersUrl = environment.serverUrl + '/api/GetAllUsers';
  private static deleteUserUrl = environment.serverUrl + '/api/DeleteUser';
  private static postUserUrl = environment.serverUrl + '/api/AddUser';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public getAllUsers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(UserApiService.getAllUsersUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
  });
  }

  public deleteUser (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(UserApiService.deleteUserUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postUser (userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(UserApiService.postUserUrl, {}, userData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
