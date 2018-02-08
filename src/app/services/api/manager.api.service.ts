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
  private static postAddRoomUrl = environment.serverUrl + '/api/AddRoom';
  private static deleteProjectUrl = environment.serverUrl + '/api/DeleteProject';
  private static putUpdateProjectPhotos = environment.serverUrl + '/api/UpdateProjectPhotos';
  private static postUpdateProjectInfo = environment.serverUrl + '/api/UpdateProjectInfo';
  private static putUpdateProjectPlan = environment.serverUrl + '/api/UpdateProjectPlan';
  private static deletePlanUrl = environment.serverUrl + '/api/DeleteProjectPlanWithRooms';
  private static deleteRoomUrl = environment.serverUrl + '/api/DeleteRoom';
  private static putUpdateProjectRoomUrl = environment.serverUrl + '/api/UpdateRoom';
  private static deleteArModelUrl = environment.serverUrl + '/api/DeleteArObject';

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

  public postAddRoom (roomData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postAddRoomUrl, {}, roomData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteProject (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ManagerApiService.deleteProjectUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateProjectPhotos(projectPhotos: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ManagerApiService.putUpdateProjectPhotos, {}, projectPhotos)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public postUpdateProjectInfo(projectInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(ManagerApiService.postUpdateProjectInfo, {}, projectInfo)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateProjectPlan(projectPlan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ManagerApiService.putUpdateProjectPlan, {}, projectPlan)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public putUpdateRoom(roomData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.put(ManagerApiService.putUpdateProjectRoomUrl, {}, roomData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deletePlan (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ManagerApiService.deletePlanUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteRoom (imageRoomId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ManagerApiService.deleteRoomUrl, {imageRoomId})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

  public deleteArModel (id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.delete(ManagerApiService.deleteArModelUrl, {id})
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }
}
