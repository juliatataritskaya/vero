import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private linkItems = [];

  private userName = localStorage.getItem('userName');
  private companyName = localStorage.getItem('companyName');
  private role = localStorage.getItem('role');
  private avatar = localStorage.getItem('avatar');
  constructor (private router: Router, private authService: AuthService) {}


  ngOnInit() {
    this.checkUserRight();
  }

  checkUserRight() {
    switch (localStorage.getItem('role')) {
      case 'SuperAdmin':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'adminpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Company settings', routerLink: 'adminpanel/company', icon: 'fa fa-cogs'},
          { name: 'Super managers', routerLink: 'adminpanel/super-manager', icon: 'fa fa-users'},
          { name: 'Managers', routerLink: 'adminpanel/manager', icon: 'fa fa-user'},
          { name: 'Projects', routerLink: 'adminpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'adminpanel/user', icon: 'icon-person'},
          { name: 'Notification', routerLink: 'adminpanel/notification', icon: 'icon-mail5'},
          { name: 'VR-tracking', routerLink: 'adminpanel/vr-tracking', icon: 'icon-eye8'}
          ];
        break;
      case 'SuperManager':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'supermanagerpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Managers', routerLink: 'supermanagerpanel/manager', icon: 'fa fa-user'},
          { name: 'Projects', routerLink: 'supermanagerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'supermanagerpanel/user', icon: 'icon-person'},
          { name: 'Notification', routerLink: 'supermanagerpanel/notification', icon: 'icon-mail5'}
        ];
        break;
      case 'Manager':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'managerpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Projects', routerLink: 'managerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'managerpanel/users', icon: 'icon-person'},
          { name: 'Notification', routerLink: 'managerpanel/notification', icon: 'icon-mail5'},
          { name: 'View in real time', routerLink: 'managerpanel/users', icon: 'icon-person'}
        ];
        break;
      default:
        localStorage.clear();
        this.router.navigate(['/start-page']);
        break;
    }
  }

  onHandleLogout() {
    this.authService.logoutUser();
      this.router.navigate(['/start-page']);
  }
}
