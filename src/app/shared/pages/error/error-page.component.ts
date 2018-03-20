import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

// declare var $: any;

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  params: any;
  errorMessage: string;
  errorCode: any;

  constructor (private route: ActivatedRoute) {}

  ngOnInit () {
    this.route.queryParams.subscribe(params => {
      this.params = params.code;
    });
    this.onLoadPage();
  }

  onLoadPage() {
    if(!this.params) {
      this.errorMessage = 'Page not found';
      this.errorCode = 404;
    } else if (this.params === '404') {
      this.errorMessage = 'Not Found';
      this.errorCode = 404;
    } else if (this.params === '500') {
      this.errorMessage = 'Server Error';
      this.errorCode = 500;
    } else {
      this.errorMessage = 'Something was wrong';
    }
  }
}
