import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { Location } from '@angular/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private static baseUri = ['start-page', 'auth/login', 'auth', ''];

  constructor (private router: Router, private location: Location) {}

  canActivate (): Observable<boolean> | boolean {
    console.log(this.router.url);
    // console.log(location.path())
    console.log(localStorage.getItem('role').toLowerCase());
    if (this.router.url.toLowerCase().substr(1) === localStorage.getItem('role').toLowerCase()
      || RolesGuard.baseUri.indexOf(this.router.url.toLowerCase().substr(1) ) !== -1 ) {
      return true;
    } else {
      switch (localStorage.getItem('role')) {
        case 'Admin':
          this.router.navigate(['/adminpanel']);
          break;
        case 'SuperManager':
          this.router.navigate(['/supermanagerpanel']);
          break;
        case 'Manager':
          this.router.navigate(['/managerpanel']);
          break;
        default:
          this.router.navigate(['/start-page']);
          break;
      }
    }
  //     switch (localStorage.getItem('role')) {
  //       case 'Admin':
  //         this.router.navigate(['/main/adminpanel']);
  //         break;
  //       case 'SuperManager':
  //         this.router.navigate(['/main/supermanagerpanel']);
  //         break;
  //       case 'Manager':
  //         this.router.navigate(['/main/managerpanel']);
  //         break;
  //       default:
  //         this.router.navigate(['/start-page']);
  //         break;
  //     }
  //   return true;
  }
}
