import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseHttpService} from './base.http.service';

@Injectable()
export class NotificationApiService extends BaseHttpService {
  private static postNotificationUrl = environment.serverUrl + '/api/SendNotification';

  constructor (protected http: HttpClient) {
    super(http);
  }

  public postNotification (notificationData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.post(NotificationApiService.postNotificationUrl, {}, notificationData)
        .subscribe(result => {
          resolve(result);
        }, error => {
          reject(error);
        });
    });
  }

}
