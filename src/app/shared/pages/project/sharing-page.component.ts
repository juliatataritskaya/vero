import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sharing-page',
  templateUrl: './sharing-page.component.html'
})
export class SharingProjectComponent implements OnInit {
  token: string;
  userId: string;
  constructor (private route: ActivatedRoute) {
  }

  ngOnInit () {
    this.route.queryParams.subscribe(params => {
      localStorage.setItem('projectId', params.project);
      params.user ? localStorage.setItem('userId', params.user) : localStorage.setItem('userId', '');
      localStorage.setItem('type', 'view');
      localStorage.getItem('token') ? () => {} : localStorage.setItem('token', '');
    });
  }

}
