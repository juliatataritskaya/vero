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
  private static getOnlineUsersUrl = environment.serverUrl + '/api/GetListOfUsersOnline';
  private static getAgeRangeUserInfoUrl = environment.serverUrl + '/api/GetAgeRangeUserInfo';
  private static getUsersForMapUrl = environment.serverUrl + '/api/GetUsersForMap';
  private static putChangeProjectCodeUrl = environment.serverUrl + '/api/ChangeProjectCode';
  private static getTypesOfUserDevicesUrl = environment.serverUrl + '/api/GetTypesOfUserDevices';
  private static getProjectAndUsersInfo = environment.serverUrl + '/api/GetProjectAndUsersInfo';
  private static getUserHistoryOfTimeSpent = environment.serverUrl + '/api/GetUserHistoryOfTimeSpent';
  private static getUsersHistoryByPeriod = environment.serverUrl + '/api/GetUsersHistoryByPeriod';
  private static exportToExcelUsersWithProjects = environment.serverUrl + '/api/ExportToExcelUsersWithProjects';

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

  public getOnlineUsers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getOnlineUsersUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getAgeRangeUserInfo (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getAgeRangeUserInfoUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getUsersForMap (filter): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getUsersForMapUrl, {filter})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putChangeProjectCode (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(DashboardApiService.putChangeProjectCodeUrl, {}, projectData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getTypesOfUserDevices (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getTypesOfUserDevicesUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getProjectAndUsersInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getProjectAndUsersInfo, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public exportToExcelUsersWithProjects (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(DashboardApiService.exportToExcelUsersWithProjects, {}, projectData)
        .subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error);
        });
    });
  }

  public getUsersHistoryByPeriod(fromMonth, fromYear, toMonth, toYear): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getUsersHistoryByPeriod, {fromMonth, fromYear, toMonth, toYear})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getUserHistoryOfTimeSpent(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(DashboardApiService.getUserHistoryOfTimeSpent, {id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
