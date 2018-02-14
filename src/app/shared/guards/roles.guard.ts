import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { Location } from '@angular/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private static baseUri = ['start-page', 'auth/login', 'auth', ''];

  constructor (private router: Router, private location: Location) {}

  canActivate (route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    console.log(1);
    console.log(localStorage.getItem('role'), route.data.expectedRole);

    if (localStorage.getItem('role') != route.data.expectedRole ) {
      switch (localStorage.getItem('role')) {
        case 'SuperAdmin':
          this.router.navigate(['/main/adminpanel']);
          break;
        case 'SuperManager':
          this.router.navigate(['/main/supermanagerpanel']);
          break;
        case 'Manager':
          this.router.navigate(['/main/managerpanel']);
          break;
        default:
          this.router.navigate(['/start-page']);
          break;
      }
      return false;
    }
    return true;
  }
}
