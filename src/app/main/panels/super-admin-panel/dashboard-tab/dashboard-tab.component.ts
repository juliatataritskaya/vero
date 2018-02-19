import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ProjectService} from '../../../../services/project.service';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';

declare var $: any;
declare var Morris: any;

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  countSuperManagers: number;
  countManagers: number;
  countCustomers: number;
  projectsAll: Array<any>;
  usersAll: Array<any>;
  url = environment.serverUrl;
  numberOfActiveUsersPerMonth: number;
  numberOfRegisteredUsersPerMonth: number;

  constructor(private dashboardService: DashboardService, private redirectService: RedirectService,
              private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit() {
    this.getCountManagers();
    this.getCountCustomers();
    this.getCountSuperManagers();
    this.getAllProjects();
    this.getAllUsers();
    this.dashboardService.getTime();
    this.createJVectorMaps();
    this.createDiagrams();
    this.getNewUsersPerMonth();
    this.getActiveUsersPerMonth();
    this.getListNewUsersIn24();
  }

  private getCountCustomers() {
    this.dashboardService.getCountCustomers().then(result => {
     this.countCustomers = result.count;
    }, error => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getCountManagers() {
    this.dashboardService.getCountManagers().then(result => {
      this.countManagers = result.count;
    }, error => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getCountSuperManagers() {
    this.dashboardService.getCountSuperManagers().then(result => {
      this.countSuperManagers = result.count;
    }, error => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getNewUsersPerMonth() {
    this.dashboardService.getNewUsersPerMonth().then(result => {
      this.numberOfRegisteredUsersPerMonth = result.numberOfRegisteredUsersPerMonth;
    }, error => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getActiveUsersPerMonth() {
    this.dashboardService.getActiveUsersPerMonth().then((result) => {
      this.numberOfActiveUsersPerMonth = result.numberOfActiveUsersPerMonth;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getListNewUsersIn24() {
    this.dashboardService.getListNewUsersIn24().then((result) => {
      console.log(result);
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private createDiagrams() {
    const dataAge = [
      {label: 'under 18', value: 2513},
      {label: '18-30', value: 764},
      {label: '30-50', value: 311},
      {label: 'over 50', value: 311}
    ];
    const dataDevices = [
      {label: 'iphone', value: 253},
      {label: 'android', value: 64}
    ];
    const ageDiagramColors = ['#33414E', '#1caf9a', '#FEA223', '#B64645'];
    const devicesDiagramColors = ['#33414E', '#1caf9a'];
    this.dashboardService.createDiagram('dashboard-donut-age', dataAge, ageDiagramColors);
    this.dashboardService.createDiagram('dashboard-donut-device', dataDevices, devicesDiagramColors);
  }

  private createJVectorMaps() {
    const markersDE = [{latLng: [53.1299986, 8.220004434], name: 'Oldenburg - 1'},
      {latLng: [52.52, 13.40], name: 'Berlin - 2'},
      {latLng: [52.40040489, 13.06999263], name: 'Potsdam - 2'},
      {latLng: [53.55002464, 9.999999144], name: 'Hamburg - 1'},
      {latLng: [48.12994204, 11.57499345], name: 'Munich - 1'}];
    const markersNL = [{latLng: [51.9199691, 4.479974323], name: 'Rotterdam - 2'},
          {latLng: [52.34996869, 4.916640176], name: 'Amsterdam - 1'},
          {latLng: [52.52400009, 6.096996529], name: 'Zwolle - 1'},
          {latLng: [51.42997316, 5.50001542], name: 'Eindhoven - 1'}];
    this.dashboardService.createJVectorMap('dashboard-map-de', 'de_mill', markersDE);
    this.dashboardService.createJVectorMap('dashboard-map-nl', 'nl_mill', markersNL);
  }

  private getAllProjects() {
    this.projectService.getAllProjects().then((result) => {
      this.projectsAll = result['projectList'];
      console.log(this.projectsAll);
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getAllUsers() {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.usersAll = result['userList'];
      console.log(this.usersAll);
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  goToEditor(id) {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '', 'width=600,height=400');
    localStorage.setItem('projectId', id);
  }

}
