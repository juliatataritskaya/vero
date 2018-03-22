import {Injectable} from '@angular/core';
import {UserApiService} from './api/user.api.service';

@Injectable()
export class UserService {

  constructor (private userApi: UserApiService) {
  }

  public getAllUser (filter): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.getAllUsers(filter).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getAllUserWithoutFilter (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.getAllUsersWithoutFilter().then(result => {
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

  public updateUser (userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.putEditUser(userData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addUsersToProject (userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userApi.postAddUsersToProject(userData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }


}
