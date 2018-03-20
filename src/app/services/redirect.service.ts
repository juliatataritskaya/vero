import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RedirectService {

  constructor(private router: Router) {
  }

  private redirectOnLoginPage() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  private redirectOnErrorPage(statusCode) {
    this.router.navigate(['/error-page'], { queryParams: { code: statusCode } });
  }

  public checkRedirect(statusCode, callback) {
    if (statusCode === 401) {
      this.redirectOnLoginPage();
    } else if (statusCode === 404 || statusCode === 500 || statusCode === 0) {
      this.redirectOnErrorPage(statusCode);
    } else {
      callback('Something was wrong, please try again.');
    }
  }
}
