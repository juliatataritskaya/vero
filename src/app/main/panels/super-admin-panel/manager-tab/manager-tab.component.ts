import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-manager-tab',
  templateUrl: './manager-tab.component.html',
  styleUrls: ['./manager-tab.component.css']
})
export class ManagerTabComponent implements OnInit {

  constructor (private router: Router, private fb: FormBuilder) {
  }

  ngOnInit () {
  }

}
