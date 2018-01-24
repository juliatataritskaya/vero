import {Injectable} from '@angular/core';
import {IProject} from '../shared/models/project.model';
import {Router} from '@angular/router';

@Injectable()
export class RedirectService {

  constructor (private router: Router) {
  }

  public redirectOnLoginPage () {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
