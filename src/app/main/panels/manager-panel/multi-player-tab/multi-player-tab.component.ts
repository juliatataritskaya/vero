import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-multi-player-tab',
  templateUrl: './multi-player-tab.component.html'
})
export class MultiPlayerTabComponent implements OnInit {
  constructor () {
  }

  ngOnInit () {
    this.openMP();
  }

  public openMP() {
    localStorage.setItem('type', 'mp');
  }
}
