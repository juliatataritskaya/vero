import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ProjectService} from '../../../../services/project.service';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {Router} from '@angular/router';
import * as FileSaver from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  countSuperManagers: number;
  countManagers: number;
  countCustomers: number;
  countNewUsers: number;
  projectsAll: Array<any> = [];
  projectsWithUserData: Array<any> = [];
  listUsersForMaps: Array<any> = [];
  userHistory: Array<any> = [];
  infoMessage: string;
  usersAll: Array<any> = [];
  newUsersPerDay: Array<any> = [];
  url = environment.serverUrl;
  onlineUsers: Array<any> = [];
  onlineUsersForDisplaying: Array<any> = [];
  usersOverviewList: Array<any> = [];

  constructor(private dashboardService: DashboardService, private redirectService: RedirectService,
              private projectService: ProjectService, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.getCountManagers();
    this.getAllProjects(() => {
      this.getAllUsers();
    });
    this.getOnlineUsers();
    setInterval(() => {
      this.getOnlineUsers();
    }, 15000);
    this.getCountCustomers();
    this.getCountSuperManagers();
    this.dashboardService.getTime();
    this.createJVectorMaps();
    this.getTypesOfUserDevices();
    this.getNewUsersPerMonth();
    this.getListNewUsersIn24();
    this.dashboardService.runOwlCarousel();
    this.getAgeRangeUserInfo();
    this.getProjectAndUsersInfo();
    this.getUserActivity();
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
      this.countNewUsers = result.numberOfRegisteredUsersPerMonth;
    }, error => {
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
      this.projectsWithUserData = result.users;
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getUserActivity() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const toMonth = date.getMonth() + 1;
    const toYear = date.getFullYear();
    date.setMonth(date.getMonth() - 2);
    const fromMonth = date.getMonth() + 1;
    const fromYear = date.getFullYear();
    this.dashboardService.getUsersHistoryByPeriod(fromMonth, fromYear, toMonth, toYear).then((result) => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      let data = [];
      result.userStatistics.forEach((monthData) => {
          data.push(
            {y: monthNames[monthData.month - 1],
            a: monthData.numberOfActiveUsers ,
            b: monthData.numberOfNewUsers,
            c: monthData.numberOfReturnedUsers}
            );
      });
      this.getGraph(data);
    });
  }

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

  private getAllProjects(callback) {
    this.projectService.getAllProjects().then((result) => {
      this.projectsAll = result['projectList'];
      callback();
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getAllUsers() {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.usersAll = result['userList'];
      this.usersAll.forEach((user) => {
        if(user.country == 'Netherlands' || user.country == 'Germany'){
          user.projectIds.forEach((id) => {
            const foundProject = this.projectsAll.find((project) => {
              return project.id == id;
            });
            if (foundProject) {
              if (user.projects) {
                user.projects.push(foundProject);
              } else {
                user.projects = [foundProject];
              }
            }
          });
          this.listUsersForMaps.push(user);
        }
      });
    }, (error) => {
      if (error.status === 401) {
        this.redirectService.redirectOnLoginPage();
      }
    });
  }

  private getOnlineUsers() {
    this.dashboardService.getOnlineUsers().then((result) => {
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
    this.router.navigate(['main/adminpanel/vr-tracking']);
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

  public getGraph(data) {
    const ykeys = ['a', 'b', 'c'];
    const labels = ['Active Users', 'New Users', 'Returned'];
    const barColors = ['#33414E', '#1caf9a', '#FEA223'];
    this.dashboardService.getGraph('dashboard-bar-user-activity', data, 'y', ykeys, labels, barColors);
  }

  getAgeRangeUserInfo() {
    this.dashboardService.getAgeRangeUserInfo().then((result) => {
      let ageRange24 = 0;
      let ageRange25_34 = 0;
      let ageRange35_44 = 0;
      let ageRange45_64 = 0;
      let ageRange65 = 0;
      result.users.forEach((user) => {
        if (user.ageRange == '24-') {
          ageRange24 = ageRange24 + 1;
        }
        if (user.ageRange == '25-34') {
          ageRange25_34 = ageRange25_34 + 1;
        }
        if (user.ageRange == '35-44') {
          ageRange35_44 = ageRange35_44 + 1;
        }
        if (user.ageRange == '45-64') {
          ageRange45_64 = ageRange45_64 + 1;
        }
        if (user.ageRange == '65+') {
          ageRange65 = ageRange65 + 1;
        }
      });
      const dataAge = [
        {label: '24-', value: ageRange24},
        {label: '25-34', value: ageRange25_34},
        {label: '35-44', value: ageRange35_44},
        {label: '45-64', value: ageRange45_64},
        {label: '65+', value: ageRange65}
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
    if (type == 'excel') {
      const projectData = new FormData();
      projectData.append('projectId', data.id);
        this.dashboardService.exportToExcelUsersWithProjects(projectData).then((result) => {
          console.log(result);
          const file = new Blob([result.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          console.log(file);
          const fileName = result.headers.get('Content-Disposition').split(';')[1].trim().split('=')[1];
          console.log(fileName);
          FileSaver.saveAs(file, fileName);
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

  seeHistory(id) {
    // $('#userHistory').modal('show');
    const date = new Date();
    date.setDate(date.getDate());
    const toDay = date.getDate();
    const toMonth = date.getMonth() + 1;
    const toYear = date.getFullYear();
    date.setDate(date.getDate() - 6);
    const fromDay = date.getDate();
    const fromMonth = date.getMonth() + 1;
    const fromYear = date.getFullYear();
    console.log(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear);
    this.dashboardService.getUserHistoryOfTimeSpent(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear)
      .then((result) => {
      this.userHistory = result.userHistory;
      if(this.userHistory['projects'].length != 0) {
        this.userHistory['projects'].forEach((project) => {
          project.places.forEach((place) => {
            place['projectName'] = project.name;
          });
        });
      }
    });
  }

}
