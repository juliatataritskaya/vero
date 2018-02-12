import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class CompanyApiService extends BaseHttpService {
  private static getCompanySettingsUrl = environment.serverUrl + '/api/GetCompanySettings';
  private static putCompanySettingsUrl = environment.serverUrl + '/api/UpdateCompanySettings';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public getCompanySettings (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(CompanyApiService.getCompanySettingsUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putCompanySettings (companyData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(CompanyApiService.putCompanySettingsUrl, {}, companyData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
