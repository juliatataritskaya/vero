import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';
import {IResultInfo} from '../../shared/models/success-response.model';
import {IProject} from '../../shared/models/project.model';

@Injectable()
export class ManagerApiService extends BaseHttpService {
  private static createProjectUrl = environment.serverUrl + '/api/createProject';
  private static getAllProjectsUrl = environment.serverUrl + '/api/getProjectList';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public postCreateProject (projectData: any): Promise<IResultInfo> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.createProjectUrl, {}, projectData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getAllProjects (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(ManagerApiService.getAllProjectsUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
