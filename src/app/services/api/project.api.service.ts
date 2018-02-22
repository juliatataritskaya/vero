import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';
import {IResultInfo} from '../../shared/models/success-response.model';
import {IProject} from '../../shared/models/project.model';

@Injectable()
export class ProjectApiService extends BaseHttpService {
  private static getAllProjectsUrl = environment.serverUrl + '/api/getProjectList';
  private static postAddProjectInfoUrl = environment.serverUrl + '/api/AddProjectInfo';
  private static postAddProjectPhotosUrl = environment.serverUrl + '/api/AddProjectPhotos';
  private static postAddProjectPlanUrl = environment.serverUrl + '/api/AddProjectPlan';
  private static postAddProjectArUrl = environment.serverUrl + '/api/AddProjectAr';
  private static postAddRoomUrl = environment.serverUrl + '/api/AddRoom';
  private static deleteProjectUrl = environment.serverUrl + '/api/DeleteProject';
  private static putUpdateProjectPhotos = environment.serverUrl + '/api/UpdateProjectPhotos';
  private static postUpdateProjectInfo = environment.serverUrl + '/api/UpdateProjectInfo';
  private static putUpdateProjectPlan = environment.serverUrl + '/api/UpdateProjectPlan';
  private static deletePlanUrl = environment.serverUrl + '/api/DeleteProjectPlanWithRooms';
  private static deleteRoomUrl = environment.serverUrl + '/api/DeleteRoom';
  private static putUpdateProjectRoomUrl = environment.serverUrl + '/api/UpdateRoom';
  private static deleteArModelUrl = environment.serverUrl + '/api/DeleteArObject';
  private static getShareProjectUrl = environment.serverUrl + '/api/GetLinkForShareProject';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public getAllProjects (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(ProjectApiService.getAllProjectsUrl, {})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectInfo (projectData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postAddProjectInfoUrl, {}, projectData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectPhotos (projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postAddProjectPhotosUrl, {}, projectPhotos)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectPlan (projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postAddProjectPlanUrl, {}, projectPlan)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddProjectAr (projectAr: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postAddProjectArUrl, {}, projectAr)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postAddRoom (roomData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postAddRoomUrl, {}, roomData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteProject (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ProjectApiService.deleteProjectUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateProjectPhotos(projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ProjectApiService.putUpdateProjectPhotos, {}, projectPhotos)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postUpdateProjectInfo(projectInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ProjectApiService.postUpdateProjectInfo, {}, projectInfo)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateProjectPlan(projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ProjectApiService.putUpdateProjectPlan, {}, projectPlan)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateRoom(roomData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ProjectApiService.putUpdateProjectRoomUrl, {}, roomData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deletePlan (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ProjectApiService.deletePlanUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteRoom (imageRoomId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ProjectApiService.deleteRoomUrl, {imageRoomId})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteArModel (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ProjectApiService.deleteArModelUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public getShareProject (id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(ProjectApiService.getShareProjectUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }
}
