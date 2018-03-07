import {Injectable} from '@angular/core';
import {ProjectApiService} from './api/project.api.service';
import {IProject} from '../shared/models/project.model';

@Injectable()
export class ProjectService {

  constructor (private projectApi: ProjectApiService) {
  }

  public getAllProjects (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.getAllProjects().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectInfo (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.postAddProjectInfo(JSON.stringify(projectData)).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectPhotos (projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.postAddProjectPhotos(projectPhotos).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectPlan (projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.postAddProjectPlan(projectPlan).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addProjectAr (projectAr: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.postAddProjectAr(projectAr).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addRoom (roomdata: any): Promise<any> {
    console.log(1);
    return new Promise((resolve, reject) => {
      this.projectApi.postAddRoom(roomdata).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteProject (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.deleteProject(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectPhotos(projectPhotos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.putUpdateProjectPhotos(projectPhotos).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectInfo(projectInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.postUpdateProjectInfo(JSON.stringify(projectInfo)).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateProjectPlan(projectPlan): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.putUpdateProjectPlan(projectPlan).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public updateRoom(roomData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.putUpdateRoom(roomData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deletePlan (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.deletePlan(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteRoom (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.deleteRoom(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public deleteArModel (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.deleteArModel(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getShareProject (id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectApi.getShareProject(id).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
