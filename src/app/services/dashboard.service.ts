import {Injectable} from '@angular/core';
import {DashboardApiService} from './api/dashboard.api.service';

declare var Morris: any;
declare var $: any;

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
      const hour    = now.getHours();
      const minutes = now.getMinutes();

      const hourStr = hour < 10 ? '0' + hour : hour;
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;

      $('.plugin-clock').html(hourStr + "<span id='blink'> : </span>" + minutesStr);
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

  public createDiagram(element, data, colors) {
    Morris.Donut({
      element: element,
      data: data,
      colors: colors,
      resize: true
    });
  }

  public createJVectorMap(htmlId, mapName, markers) {
    $('#' + htmlId).vectorMap({
      map: mapName,
      backgroundColor: '#FFFFFF',
      regionsSelectable: true,
      regionStyle: {
        selected: {fill: '#B64645'},
        initial: {fill: '#33414E'}
      },
      markerStyle: {
        initial: {
          fill: '#1caf9a',
          stroke: '#1caf9a'
        }
      },
      markers: markers,
      onMarkerClick: function(e, code, z, c, t){
        alert('click');
      }
    });
  }

  public runOwlCarousel(){
    $(".owl-carousel").owlCarousel
    ({mouseDrag: false, touchDrag: true, slideSpeed: 300, paginationSpeed: 400,
      singleItem: true, navigation: false, autoPlay: true, item: 1});
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

  public getActiveUsersPerMonth (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getActiveUsersPerMonth().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getNewUsersPerMonth (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getNewUsersPerMonth().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getListNewUsersIn24 (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getListNewUsersIn24().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getOnlineUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getOnlineUsers().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getAgeRangeUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getAgeRangeUserInfo().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getUsersForMap(filter): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getUsersForMap(filter).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public changeProjectCode(projectdata): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.putChangeProjectCode(projectdata).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getTypesOfUserDevices(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getTypesOfUserDevices().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getProjectAndUsersInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getProjectAndUsersInfo().then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public exportToExcelUsersWithProjects(projectdata) {
      this.dashboardApi.exportToExcelUsersWithProjects(projectdata);
  }

  public getUsersHistoryByPeriod(fromMonth, fromYear, toMonth, toYear): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getUsersHistoryByPeriod(fromMonth, fromYear, toMonth, toYear).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getUserHistoryOfTimeSpent(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.getUserHistoryOfTimeSpent(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public addUserToProjects(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dashboardApi.postAddUserToProjects(data).then(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  public getGraph(element, data, xkey, ykeys, labels, barColors) {
    Morris.Bar({
      element: element,
      data: data,
      xkey: xkey,
      ykeys: ykeys,
      labels: labels,
      barColors: barColors,
      gridTextSize: '10px',
      hideHover: true,
      resize: true,
      gridLineColor: '#E5E5E5'
    });
  }

}
