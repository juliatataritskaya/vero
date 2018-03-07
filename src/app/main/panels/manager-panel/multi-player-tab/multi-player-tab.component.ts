import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-multi-player-tab',
  templateUrl: './multi-player-tab.component.html',
  styleUrls: ['./multi-player-tab.component.css']
})
export class MultiPlayerTabComponent implements OnInit {
  constructor () {
  }

  ngOnInit () {
    this.openMP();
  }

  public openMP() {
    // const newWin = window.open('../../../../../assets/js/plugins/unity/index.html', '', 'width=600,height=400');
    localStorage.setItem('type', 'mp');
  }



}
