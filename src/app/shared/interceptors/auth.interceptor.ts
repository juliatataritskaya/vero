import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor () {
  }

  private static basicAuthUrls = [environment.serverUrl + '/api/auth/registration',
    environment.serverUrl + '/api/auth/login', environment.serverUrl + '/api/auth/refresh',
    environment.serverUrl + '/api/auth/password/forgot', environment.serverUrl + '/api/auth/password/forgot/reset'];

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (new RegExp(`^${environment.serverUrl}`).test(req.url)) {
      let authHeader;
      if (AuthInterceptor.basicAuthUrls.indexOf(req.url) === -1) {
        if (!AuthService.ACCESS_TOKEN) {
          return Observable.throw('User not authorized.');
        } else {
          authHeader = AuthService.ACCESS_TOKEN;
        }
      } else {
        authHeader = AuthService.BASIC_TOKEN;
      }
      const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});

      return Observable.create(observer => {
        next.handle(authReq).subscribe(event => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
              if (!AuthService.REFRESH_TOKEN) {
                observer.next(event);
              } else {
                const refreshTokenReq = req.clone(
                  {
                    headers: req.headers.set('Authorization', AuthService.BASIC_TOKEN),
                    method: 'POST',
                    url: AuthInterceptor.basicAuthUrls[2],
                    body: {refreshToken: AuthService.REFRESH_TOKEN}
                  }
                );
                next.handle(refreshTokenReq).subscribe(refreshTokenEvent => {
                  if (refreshTokenEvent instanceof HttpResponse) {
                    if (refreshTokenEvent.status !== 200) {
                      observer.next(event);
                    } else {
                      const newAuthReq = req.clone({
                        headers: req.headers.set('Authorization',
                          refreshTokenEvent.body.bearerToken)
                      });
                      localStorage.setItem('access_token', refreshTokenEvent.body.bearerToken);
                      localStorage.setItem('refresh_token', refreshTokenEvent.body.refreshToken);
                      next.handle(newAuthReq).subscribe(newAuthEvent => {
                        if (newAuthEvent instanceof HttpResponse) {
                          observer.next(newAuthEvent);
                        }
                      });
                    }
                  }
                });
              }
            } else {
              observer.next(event);
            }
          }
        });
      });
    } else {
      let headers = req.headers.set('Content-Type', 'application/json');
      headers = headers.set('Access-Control-Allow-Origin', '*');

      const proceedReq = req.clone({headers});
      return next.handle(proceedReq);
    }
  }
}
