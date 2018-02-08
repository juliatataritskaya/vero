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
      this.managerApi.postUpdateProjectInfo(JSON.stringify(projectInfo)).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectPlan(projectPlan): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.putUpdateProjectPlan(projectPlan).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateRoom(roomData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.putUpdateRoom(roomData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deletePlan (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.deletePlan(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteRoom (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.deleteRoom(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteArModel (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.managerApi.deleteArModel(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
