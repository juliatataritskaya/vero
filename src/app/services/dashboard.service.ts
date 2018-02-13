import {Injectable} from '@angular/core';
import {DashboardApiService} from './api/dashboard.api.service';

@Injectable()
export class DashboardService {

  constructor(private dashboardApi: DashboardApiService) {
  }

  public getTime() {

    this.tp_clock();
    this.tp_date();
  }

  public tp_clock() {

    function tp_clock_time() {
      const now     = new Date();
      let hour    = now.getHours();
      let minutes = now.getMinutes();

      hour = hour < 10 ? 0 + hour : hour;
      minutes = minutes < 10 ? 0 + minutes : minutes;

      $('.plugin-clock').html(hour + "<span id='blink'> : </span>" + minutes);
    }
    if ($('.plugin-clock').length > 0) {

      tp_clock_time();

      window.setInterval(function(){
        tp_clock_time();
      }, 10000 );

    }
  }

  public tp_date () {

    if ($('.plugin-date').length > 0) {

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

      const now = new Date();
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();

      $('.plugin-date').html(day + ', ' + month + ' ' + date + ', ' + year);
    }

  }

  public getCountManagers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getCountManagers().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getCountSuperManagers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getCountSuperManagers().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getCountCustomers (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getCountCustomers().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }


}
