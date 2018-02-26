import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ProjectService} from '../../../../services/project.service';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {Router} from '@angular/router';
import * as FileSaver from 'file-saver';

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
  projectsAll: Array<any> = [];
  projectsWithUserData: Array<any> = [];
  testprojects: object;
  infoMessage: string;
  usersAll: Array<any> = [];
  newUsersPerDay: Array<any> = [];
  url = environment.serverUrl;
  numberOfActiveUsersPerMonth: number;
  numberOfRegisteredUsersPerMonth: number;
  onlineUsers: Array<any> = [];
  onlineUsersForDisplaying: Array<any> = [];
  usersOverviewList: Array<any> = [];

  constructor(private dashboardService: DashboardService, private redirectService: RedirectService,
              private projectService: ProjectService, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.getCountManagers();
    setInterval(() => {
      this.getOnlineUsers()
    }, 15000);
    this.getCountCustomers();
    this.getCountSuperManagers();
    this.getAllProjects();
    this.getAllUsers();
    this.dashboardService.getTime();
    this.createJVectorMaps();
    this.getTypesOfUserDevices();
    this.getNewUsersPerMonth();
    // this.getActiveUsersPerMonth();
    this.getListNewUsersIn24();
    this.dashboardService.runOwlCarousel();
    this.getGraph();
    this.getAgeRangeUserInfo();
    this.getProjectAndUsersInfo();
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
      this.newUsersPerDay = result.newUsersPerDay;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getProjectAndUsersInfo() {
    this.dashboardService.getProjectAndUsersInfo().then((result) => {
      console.log(result);
      this.projectsWithUserData = result.users;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  // private createDiagrams() {
  //   // const dataAge = [
  //   //   {label: 'under 18', value: 2513},
  //   //   {label: '18-21', value: 764},
  //   //   {label: 'more than 21', value: 311}
  //   // ];
  //
  // }

  private createJVectorMaps() {
    let markersNL = [];
    let markersDE = [];

    this.dashboardService.getUsersForMap('Netherlands').then((result) => {
      result.usersForMap.forEach((point) => {
        markersNL.push({latLng: [point.lat, point.lng], name: point.city + ' - ' + point.users.length});
      });
      this.dashboardService.createJVectorMap('dashboard-map-nl', 'nl_mill', markersNL);
    });
    this.dashboardService.getUsersForMap('Germany').then((result) => {
      result.usersForMap.forEach((point) => {
        markersDE.push({latLng: [point.lat, point.lng], name: point.city + ' - ' + point.users.length});
      });
      this.dashboardService.createJVectorMap('dashboard-map-de', 'de_mill', markersDE);
    });
  }

  private getAllProjects() {
    this.projectService.getAllProjects().then((result) => {
      this.projectsAll = result['projectList'];
      this.testprojects = result;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getAllUsers() {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.usersAll = result['userList'];
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getOnlineUsers() {
    this.dashboardService.getOnlineUsers().then((result) => {
      console.log(result['onlineUsers']);
      this.onlineUsers = result['onlineUsers'];
      this.onlineUsersForDisplaying = this.onlineUsers;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  goToEditor(id) {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html',
      '', 'width=600,height=400');
    localStorage.setItem('projectId', id);
    localStorage.setItem('type', 'edit');
  }

  search(target) {
    this.onlineUsersForDisplaying = this.onlineUsers.filter(function (user) {
      return user.name.toLowerCase().indexOf(target.value.toLowerCase()) !== -1;
    });
  }

  connect(email) {
    localStorage.setItem('userId', email);
    this.router.navigate(['main/adminpanel/multi-player']);
  }

  public getTypesOfUserDevices() {
    this.dashboardService.getTypesOfUserDevices().then((result) => {
      let dataDevices = [];
      result.devicetypes.forEach((dev) => {
        dataDevices.push({label: dev.deviceType, value: dev.number});
      });
      const devicesDiagramColors = ['#33414E', '#1caf9a', '#FEA223', '#B64645'];
      this.dashboardService.createDiagram('dashboard-donut-device', dataDevices, devicesDiagramColors);
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  public getGraph() {
    const data = [
      {y: 'September', a: 75, b: 35, c: 0},
      {y: 'October', a: 64, b: 26, c: 2},
      {y: 'November', a: 78, b: 39, c: 4},
      {y: 'December', a: 82, b: 34, c: 3},
      {y: 'January', a: 86, b: 39, c: 2},
      {y: 'February', a: 94, b: 40, c: 1},
    ];
    const ykeys = ['a', 'b', 'c'];
    const labels = ['Active Users', 'New Users', 'Returned'];
    const barColors = ['#33414E', '#1caf9a', '#FEA223'];
    this.dashboardService.getGraph('dashboard-bar-user-activity', data, 'y', ykeys, labels, barColors);
  }

  getAgeRangeUserInfo() {
    this.dashboardService.getAgeRangeUserInfo().then((result) => {
      let thirteen = 0;
      let eighteen = 0;
      let twentyOne = 0;
      result.users.forEach((user) => {
        if (user.ageRange == 13) {
          thirteen = thirteen + 1;
        }
        if (user.ageRange == 18) {
          eighteen = eighteen + 1;
        }
        if (user.ageRange == 21) {
          twentyOne = twentyOne + 1;
        }
      });
      const dataAge = [
        {label: 'under 18', value: thirteen},
        {label: '18-21', value: eighteen},
        {label: 'more than 21', value: twentyOne}
      ];
      const ageDiagramColors = ['#33414E', '#1caf9a', '#FEA223', '#B64645'];
      this.dashboardService.createDiagram('dashboard-donut-age', dataAge, ageDiagramColors);
      $('#dashboard-donut-age').on('click', function () {
        alert('qqwqqq');
      });

    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  public exportData(type, data) {
    console.log(data);
    if (type == 'excel') {
      const projectData = new FormData();
      projectData.append('projectId', data.id);
        this.dashboardService.exportToExcelUsersWithProjects(projectData).then((result) => {
          console.log(result);
        }, (error) => {
          if (error.status === 401) {
            this.redirectService.redirectOnLoginPage();
          }
        });
    }

    if (type == 'json') {
      const blob = new Blob([JSON.stringify({project: data})], {type: 'text/json'});
      FileSaver.saveAs(blob, 'project.json');
    }

// let a = JSON.stringify(this.projectsAll);
// console.log(a);
//     var json3 = { "listOfProjects": a};
//
//
//     let DownloadJSON2CSV = function(objArray) {
//       let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//
//       var str = '';
//
//       for (var i = 0; i < array.length; i++) {
//         var line = '';
//
//         for (var index in array[i]) {
//           line += array[i][index] + ',';
//         }
//
//         // Here is an example where you would wrap the values in double quotes
//         // for (var index in array[i]) {
//         //    line += '"' + array[i][index] + '",';
//         // }
//
//         line.slice(0, line.length - 1);
//
//         str += line + '\r\n';
//       }
//       window.open( "data:text/csv;charset=utf-8," + encodeURI(str));
//       window.open( "data:text/docx;charset=utf-8," + encodeURI(str));
//     }
//     DownloadJSON2CSV(json3.listOfProjects);

  }

  changeProjectCode(id) {
    $('#infoBox').modal('show');
    if ($("#code" + id).val().length != 8) {
      this.infoMessage = 'The code should be 8 characters long.';
    } else {
      const projectData = new FormData();
      projectData.append('projectId', id);
      projectData.append('projectCode', $("#code" + id).val());

      this.dashboardService.changeProjectCode(projectData).then((result) => {
        this.infoMessage = result.succedded ? 'The code was changed' : result.error;
      }, (error) => {
        if (error.status === 401) {
          this.redirectService.redirectOnLoginPage();
        }
      });
    }
  }

  closeModal() {
    $('#infoBox').modal('hide');
    $('#userOverview').modal('hide');
    this.usersOverviewList = [];
    this.infoMessage = null;
  }

  goToProfile(id) {
    this.router.navigate(['main/adminpanel/user', {id: id}]);
  }

  goUserOverview(id, idx) {
    $('#userOverview').modal('show');
    this.usersOverviewList = this.projectsWithUserData[idx];
    console.log(this.usersOverviewList);
    console.log(id, idx);
  }

}
