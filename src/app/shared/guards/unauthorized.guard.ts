import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UnauthorizedGuard implements CanActivate {

  constructor (private router: Router) {}

  canActivate (): Observable<boolean> | boolean {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/main/dashboard']);
      return false;
    } else {
      return true;
    }
  }
}
