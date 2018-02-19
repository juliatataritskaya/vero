import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class DashboardApiService extends BaseHttpService {
  private static getCountManagersUrl = environment.serverUrl + '/api/GetCountManagers';
  private static getCountSuperManagersUrl = environment.serverUrl + '/api/GetCountSuperManagers';
  private static getCountCustomersUrl = environment.serverUrl + '/api/GetCountCustomers';
  private static getActiveUsersPerMonth = environment.serverUrl + '/api/GetNumberOfActiveUsersPerMonth';
  private static getNewUsersPerMonth = environment.serverUrl + '/api/GetNumberOfRegisteredUsersPerMonth';
  private static getListNewUsersIn24 = environment.serverUrl + '/api/GetNewUsersPerLast24hours';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public getCountManagers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getCountManagersUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getCountSuperManagers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getCountSuperManagersUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getCountCustomers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getCountCustomersUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getActiveUsersPerMonth (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getActiveUsersPerMonth, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getNewUsersPerMonth (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getNewUsersPerMonth, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getListNewUsersIn24 (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getListNewUsersIn24, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
