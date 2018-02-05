import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-super-manager-tab',
  templateUrl: './super-manager-tab.component.html',
  styleUrls: ['./super-manager-tab.component.css']
})
export class SuperManagerTabComponent implements OnInit {

  constructor (private router: Router, private fb: FormBuilder) {
  }

  ngOnInit () {
  }

}
