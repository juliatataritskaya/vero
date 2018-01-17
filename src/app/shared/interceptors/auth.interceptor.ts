import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor () {
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (new RegExp(`^${environment.serverUrl}`).test(req.url)) {
      let authHeader;
        if (!AuthService.ACCESS_TOKEN) {
          return Observable.throw('User not authorized.');
        } else {
          authHeader = AuthService.ACCESS_TOKEN;
        }
      const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});

      return Observable.create(observer => {
        next.handle(authReq).subscribe(event => {
          if (event instanceof HttpResponse) {
            observer.next(event);
          }
        });
      });
    } else {
      let headers = req.headers.set('Content-Type', 'application/form-data');
      headers = headers.set('Access-Control-Allow-Origin', '*');

      const proceedReq = req.clone({headers});
      return next.handle(proceedReq);
    }
  }
}
