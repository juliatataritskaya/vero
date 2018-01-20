import {Injectable} from '@angular/core';
import {ManagerApiService} from './api/manager.api.service';
import {IProject} from '../shared/models/project.model';

@Injectable()
export class ManagerService {

  constructor (private managerApi: ManagerApiService) {
  }

  public createProject (projectData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.managerApi.postCreateProject(projectData).then(result => {
        resolve('Project was created');
      }, error => {
        reject(error);
      });
    });
  }

  public getAllProjects (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.getAllProjects().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
