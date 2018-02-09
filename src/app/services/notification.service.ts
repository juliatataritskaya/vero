import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NotificationApiService } from './api/notification.api.service';

@Injectable()
export class NotificationService {

  constructor (private notificationApi: NotificationApiService) {
  }

  public postNotification (notificationData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.notificationApi.postNotification(notificationData).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

}
