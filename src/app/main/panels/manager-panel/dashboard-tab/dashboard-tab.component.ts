import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../../services/dashboard.service';
import {RedirectService} from '../../../../services/redirect.service';
import {ProjectService} from '../../../../services/project.service';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {Router} from '@angular/router';
import * as FileSaver from 'file-saver';
var xhttp = new XMLHttpRequest();

declare var $: any;
declare var Morris: any;

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  timer: any;
  countSuperManagers: number;
  countManagers: number;
  countCustomers: number;
  countNewUsers: number;
  projectsAll: Array<any> = [];
  projectsWithUserData: Array<any> = [];
  listUsersForMaps: Array<any> = [];
  userHistory: Array<any> = [];
  infoMessage: string;
  listProjectsForAdd: Array<any> = [];
  usersAll: Array<any> = [];
  newUsersPerDay: Array<any> = [];
  url = environment.serverUrl;
  onlineUsers: Array<any> = [];
  onlineUsersForDisplaying: Array<any> = [];
  usersOverviewList: Array<any> = [];
  userIdForAssignProject: number;

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
    this.timer = setInterval(() => {
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
      this.onErrorHandle(error);
    });
  }

  private getCountManagers() {
    this.dashboardService.getCountManagers().then(result => {
      this.countManagers = result.count;
    }, error => {
      this.onErrorHandle(error);
    });
  }

  private getCountSuperManagers() {
    this.dashboardService.getCountSuperManagers().then(result => {
      this.countSuperManagers = result.count;
    }, error => {
      this.onErrorHandle(error);
    });
  }

  private getNewUsersPerMonth() {
    this.dashboardService.getNewUsersPerMonth().then(result => {
      this.countNewUsers = result.numberOfRegisteredUsersPerMonth;
    }, error => {
      this.onErrorHandle(error);
    });
  }

  private getListNewUsersIn24() {
    this.dashboardService.getListNewUsersIn24().then((result) => {
      this.newUsersPerDay = result.newUsersPerDay;
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  private getProjectAndUsersInfo() {
    this.dashboardService.getProjectAndUsersInfo().then((result) => {
      this.projectsWithUserData = result.users;
    }, (error) => {
      this.onErrorHandle(error);
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
          {
            y: monthNames[monthData.month - 1],
            a: monthData.numberOfActiveUsers,
            b: monthData.numberOfNewUsers,
            c: monthData.numberOfReturnedUsers
          }
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
      this.onErrorHandle(error);
    });
  }

  private getAllUsers() {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.listUsersForMaps = [];
      this.usersAll = result['userList'];
      this.usersAll.forEach((user) => {
        if ((user.country == 'Netherlands' || user.country == 'Germany') && user.role == 'Customer' ) {
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
      this.onErrorHandle(error);
    });
  }

  private getOnlineUsers() {
    this.dashboardService.getOnlineUsers().then((result) => {
      this.onlineUsers = result['onlineUsers'];
      this.onlineUsersForDisplaying = this.onlineUsers;
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  goToEditor(id) {
    const newWin = window.open('../../../../../assets/js/plugins/unity/index.html',
      '', 'width=800,height=600');
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
    this.router.navigate(['main/managerpanel/vr-tracking']);
  }

  public getTypesOfUserDevices() {
    this.dashboardService.getTypesOfUserDevices().then((result) => {
      let dataDevices = [];
      result.devicetypes.forEach((dev) => {
        if(dev.deviceType){
          dataDevices.push({label: dev.deviceType, value: dev.number});
        }
      });
      const devicesDiagramColors = ['#33414E', '#2e976b', '#FEA223', '#B64645'];
      this.dashboardService.createDiagram('dashboard-donut-device', dataDevices, devicesDiagramColors);
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  public getGraph(data) {
    const ykeys = ['a', 'b', 'c'];
    const labels = ['Active Users', 'New Users', 'Returned'];
    const barColors = ['#33414E', '#2e976b', '#FEA223'];
    this.dashboardService.getGraph('dashboard-bar-user-activity', data, 'y', ykeys, labels, barColors);
  }

  public getAgeRangeUserInfo() {
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
      const ageDiagramColors = ['#33414E', '#2e976b', '#FEA223', '#B64645'];
      this.dashboardService.createDiagram('dashboard-donut-age', dataAge, ageDiagramColors);
      $('#dashboard-donut-age').on('click', () => {
        $('.ageRange').html('<h2 style="">Loading...</h2>');
        $('#ageRangeModal').modal('show');
        setTimeout(() => { this.createAgeDiagram(); }, 2000);
      });
      $('#dashboard-donut-device').on('click', () => {
        $('.device').html('<h2 style="">Loading...</h2>');
        $('#deviceModal').modal('show');
        setTimeout(() => { this.createDeviceDiagram(); }, 2000);
      });

    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  public exportData(type, data) {
    if (type == 'excel') {
      this.dashboardService.exportToExcelUsersWithProjects(1);
    }

    if (type == 'json') {
      const blob = new Blob([JSON.stringify({project: data})], {type: 'text/json'});
      FileSaver.saveAs(blob, 'project.json');
    }
  }

  public createAgeDiagram() {
    $('.ageRange').html('');
      this.projectsWithUserData.forEach((project) => {
        let ageRange24 = 0;
        let ageRange25_34 = 0;
        let ageRange35_44 = 0;
        let ageRange45_64 = 0;
        let ageRange65 = 0;
        $('.ageRange').append('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="text-align: center">' + project.name + '<div  id="project' +
          + project.id + '" style="height: 200px; width: auto"></div></div>');
        project.users.forEach((user) => {
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
        let data = [{
          y: project.name,
          a: ageRange24,
          b: ageRange25_34,
          c: ageRange35_44,
          d: ageRange45_64,
          e: ageRange65
        }];
        const ykeys = ['a', 'b', 'c', 'd', 'e'];
        const labels = ['24-', '25-34', '35-44', '45-64', '65+'];
        const barColors = ['#33414E', '#2e976b', '#FEA223'];
        this.dashboardService.getGraph('project' + project.id, data, 'y', ykeys, labels, barColors);
      });
  }

  public createDeviceDiagram() {
    $('.device').html('');
    this.projectsWithUserData.forEach((project) => {
      let iosPhone = 0;
      let iosTablet = 0;
      let androidPhone = 0;
      let androidTablet = 0;
      $('.device').append('<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="text-align: center">' + project.name + '<div  id="project' +
        + project.id + '" style="height: 200px; width: auto"></div></div>');
      project.users.forEach((user) => {
        if (user.deviceType == 'IOS Phone') {
          iosPhone = iosPhone + 1;
        }
        if (user.deviceType == 'IOS Tablet') {
          iosTablet = iosTablet + 1;
        }
        if (user.deviceType == 'Android Phone') {
          androidPhone = androidPhone + 1;
        }
        if (user.deviceType == 'Android Tablet') {
          androidTablet = androidTablet + 1;
        }
      });
      let data = [{
        y: project.name,
        a: iosPhone,
        b: iosTablet,
        c: androidPhone,
        d: androidTablet
      }];
      const ykeys = ['a', 'b', 'c', 'd'];
      const labels = ['IOS Phone', 'IOS Tablet', 'Android Phone', 'Android Tablet'];
      const barColors = ['#33414E', '#2e976b', '#FEA223'];
      this.dashboardService.getGraph('project' + project.id, data, 'y', ykeys, labels, barColors);
    });
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
        this.onErrorHandle(error);
      });
    }
  }

  closeModal() {
    $('#infoBox').modal('hide');
    $('#userOverview').modal('hide');
    $('#projectsModal').modal('hide');
    $('.ageRange').html('');
    $('.device').html('');
    this.usersOverviewList = [];
    this.infoMessage = null;
    this.userIdForAssignProject = null;
  }

  goToProfile(id) {
    $('.modal').modal('hide');
    this.router.navigate(['main/managerpanel/user', {id: id}]);
  }

  goUserOverview(id, idx) {
    $('#userOverview').modal('show');
    this.usersOverviewList = this.projectsWithUserData[idx];
  }

  seeHistory(id) {
    $('#userHistory').modal('show');
    const date = new Date();
    date.setDate(date.getDate());
    const toDay = date.getDate();
    const toMonth = date.getMonth() + 1;
    const toYear = date.getFullYear();
    date.setDate(date.getDate() - 6);
    const fromDay = date.getDate();
    const fromMonth = date.getMonth() + 1;
    const fromYear = date.getFullYear();
    this.dashboardService.getUserHistoryOfTimeSpent(id, fromDay, fromMonth, fromYear, toDay, toMonth, toYear)
      .then((result) => {
        this.userHistory = result.userHistory;
        if (this.userHistory['projects'].length != 0) {
          this.userHistory['projects'].forEach((project) => {
            project.places.forEach((place) => {
              place['projectName'] = project.name;
            });
          });
        }
      });
  }

  assignNewProject(userId) {
    this.getAllProjects(() => {
      this.getAllUsers();
      this.getBelongProject(userId);
      $('#projectsModal').modal('show');
    });
    // this.getBelongProject(userId);
    // $('#projectsModal').modal('show');
  }

  private getBelongProject(userId) {
    this.userIdForAssignProject = userId;
    const newUser = this.usersAll.find((user) => {
      return user.userId == userId;
    });
    if (newUser) {
      this.projectsAll.forEach((project) => {
        project.checked = '';
        newUser['projectIds'].forEach((id) => {
          if (project.id == id) {
            project.checked = 'true';
          }
        });
      });
    }
  }

  addProjectsToUser() {
    const listProjectsIdsForAdd = [];
    $('.assignProjects').each((index, elem) => {
      if ($(elem).prop('checked')) {
        listProjectsIdsForAdd.push(this.projectsAll[index].id);
      }
    });
    const projectData = new FormData();
    listProjectsIdsForAdd.forEach((elem) => {
      projectData.append('projectIds', elem);
    });
    projectData.append('userId', this.userIdForAssignProject.toString());
    this.dashboardService.addUserToProjects(projectData).then((result) => {
      this.infoMessage = 'Projects were changed';
      $('#infoBox').modal('show');
      this.userIdForAssignProject = null;
      this.getListNewUsersIn24();
      this.getAllUsers();
    }, (error) => {
      this.onErrorHandle(error);
    });
  }

  onErrorHandle(error) {
    error.status === 401 || error.status === 500 ? clearInterval(this.timer) : () => {};
    this.redirectService.checkRedirect(error.status, (message) => {
      if (message) {
        this.infoMessage = 'Something wrong, please try again.';
        $('#infoBox').modal('show');
      }
    });
  }
}
