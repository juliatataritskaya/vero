import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import {RedirectService} from '../../services/redirect.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor (private redirectService: RedirectService) {
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (new RegExp(`^${environment.serverUrl}`).test(req.url)) {
      let authHeader;
        if (!AuthService.ACCESS_TOKEN) {
          return Observable.throw('User not authorized.');
        } else {
          authHeader = AuthService.ACCESS_TOKEN;
        }
      let headers = req.headers.set('Authorization', authHeader);
      const authReq = req.clone({headers: headers});

      return next.handle(authReq)
        .do(event => {
          if (event instanceof HttpResponse) {
            return Observable.create(event);
          }
        })
        .catch(response => {
          if(response.status == 0){
            this.redirectService.checkRedirect(response.status, () => { });
          }
          return Observable.throw(response);
        });
    } else {
      let headers = req.headers.set('Access-Control-Allow-Origin', '*');

      const proceedReq = req.clone({headers});
      return next.handle(proceedReq);
    }
  }
}
