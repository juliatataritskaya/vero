import {Injectable} from '@angular/core';
import {ManagerApiService} from './api/manager.api.service';
import {IProject} from '../shared/models/project.model';

@Injectable()
export class ManagerService {

  constructor (private managerApi: ManagerApiService) {
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

  public addProjectInfo (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.postAddProjectInfo(JSON.stringify(projectData)).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectPhotos (projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.postAddProjectPhotos(projectPhotos).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectPlan (projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.postAddProjectPlan(projectPlan).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectAr (projectAr: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.postAddProjectAr(projectAr).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addRoom (roomdata: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.postAddRoom(roomdata).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteProject (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.deleteProject(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectPhotos(projectPhotos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.putUpdateProjectPhotos(projectPhotos).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectInfo(projectInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.putUpdateProjectInfo(projectInfo).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
