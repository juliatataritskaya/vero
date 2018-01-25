import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';
import {IResultInfo} from '../../shared/models/success-response.model';
import {IProject} from '../../shared/models/project.model';

@Injectable()
export class ManagerApiService extends BaseHttpService {
  private static getAllProjectsUrl = environment.serverUrl + '/api/getProjectList';
  private static postAddProjectInfoUrl = environment.serverUrl + '/api/AddProjectInfo';
  private static postAddProjectPhotosUrl = environment.serverUrl + '/api/AddProjectPhotos';
  private static postAddProjectPlanUrl = environment.serverUrl + '/api/AddProjectPlan';
  private static postAddProjectArUrl = environment.serverUrl + '/api/AddProjectAr';

  constructor (protected http: HttpClient) {
    super(http);
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

  public postAddProjectInfo (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postAddProjectInfoUrl, {}, projectData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectPhotos (projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postAddProjectPhotosUrl, {}, projectPhotos)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectPlan (projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postAddProjectPlanUrl, {}, projectPlan)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectAr (projectAr: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postAddProjectArUrl, {}, projectAr)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
