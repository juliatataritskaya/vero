import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {CompanyApiService} from './api/company.api.service';

@Injectable()
export class CompanyService {

  constructor (private companyApi: CompanyApiService) {
  }

  public getCompanySettings (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyApi.getCompanySettings().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateCompanySettings (companyData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.companyApi.putCompanySettings(companyData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
