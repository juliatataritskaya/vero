import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private router: Router) {}

  canActivate (): Observable<boolean> | boolean {
    if (localStorage.getItem('access_token')) {
      return true;
    } else {
      this.router.navigate(['/start-page']);
      return false;
    }
  }
}
