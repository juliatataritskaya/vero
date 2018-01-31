import {Component, OnInit} from '@angular/core';
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
          { name: 'Super managers', routerLink: 'adminpanel/company', icon: 'fa fa-users'},
          { name: 'Managers', routerLink: 'adminpanel/users', icon: 'fa fa-user'},
          { name: 'Projects', routerLink: 'adminpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'adminpanel/users', icon: 'icon-person'}
          ];
        break;
      case 'SuperManager':
        alert('superManager');
        break;
      case 'Manager':
        this.linkItems = [
          { name: 'Dashboard', routerLink: 'managerpanel/dashboard', icon: 'icon-screen3'},
          { name: 'Projects', routerLink: 'managerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'managerpanel/users', icon: 'icon-person'},
          { name: 'View in real time', routerLink: 'managerpanel/users', icon: 'icon-person'}
        ];
        break;
      default:
        localStorage.clear();
        this.router.navigate(['/start-page']);
        break;
    }
  }

  onHandleLogout(){
    this.authService.logoutUser();
      this.router.navigate(['/start-page']);
  }
}
