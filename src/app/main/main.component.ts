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
  constructor (private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRight();
  }

  checkUserRight() {
    switch (localStorage.getItem('role')) {
      case 'SuperAdmin':
        this.linkItems = [
          { name: 'Companies', routerLink: 'adminpanel/company', icon: 'icon-home4'},
          { name: 'Users', routerLink: 'adminpanel/user', icon: 'icon-person'}
          ];
        break;
      case 'SuperManager':
        alert('superManager');
        break;
      case 'Manager':
        this.linkItems = [
          { name: 'Projects', routerLink: 'managerpanel/projects', icon: 'icon-home'},
          { name: 'Users', routerLink: 'managerpanel/users', icon: 'icon-person'}
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
