import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Observable} from 'rxjs/Observable';

@Injectable()
export abstract class BaseHttpService {

  constructor (protected http: HttpClient) {
  }

  public get(url: string, params: any = {}): Observable<any> {
      return this.sendRequest(url, 'GET', this.createHttpParams(params));
  }

  public post(url: string, params: any = {}, body: any = {}): Observable<any> {
    return this.sendRequest(url, 'POST', this.createHttpParams(params), body);
  }

  public put(url: string, params: any = {}, body: any = {}): Observable<any> {
    return this.sendRequest(url, 'PUT', this.createHttpParams(params), body);
  }

  public patch(url: string, params: any = {}, body: any = {}): Observable<any> {
    return this.sendRequest(url, 'PATCH', this.createHttpParams(params), body);
  }

  public delete(url: string, params: any = {}, body: any = {}): Observable<any> {
    return this.sendRequest(url, 'DELETE', this.createHttpParams(params), body);
  }

  private createHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).map(key => {
      httpParams = httpParams.set(key, params[key]);
    });

    return httpParams;
  }

  private sendRequest (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', params: HttpParams,
                       body?: any): Observable<any> {
    let req: any;
    const options = {params};
    switch (method) {
      case 'GET':
        req = this.http.get(url, options);
        break;
      case 'POST':
        req = this.http.post(url, body, options);
        break;
      case 'PUT':
        req = this.http.put(url, body, options);
        break;
      case 'PATCH':
        req = this.http.patch(url, body, options);
        break;
      case 'DELETE':
        req = this.http.delete(url, options);
        break;
      default:
        throw new Error('Invalid request method.');
    }

    return req;
  }
}
