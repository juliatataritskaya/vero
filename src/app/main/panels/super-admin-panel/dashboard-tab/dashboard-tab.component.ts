import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  @Output() route = 'Dashboard';

  constructor() {
  }

  ngOnInit() {
    $('#dashboard-map').vectorMap({
      map: 'europe_mill_en',
      backgroundColor: '#FFFFFF',
      regionsSelectable: true,
      regionStyle: {
        selected: {fill: '#B64645'},
        initial: {fill: '#33414E'}
      },
      markerStyle: {
        initial: {
          fill: '#1caf9a',
          stroke: '#1caf9a'
        }
      },
      markers: [{latLng: [50.27, 30.31], name: 'Kyiv - 1'},
        {latLng: [52.52, 13.40], name: 'Berlin - 2'},
        {latLng: [48.85, 2.35], name: 'Paris - 1'},
        {latLng: [51.51, -0.13], name: 'London - 3'},
        {latLng: [40.71, -74.00], name: 'New York - 5'},
        {latLng: [35.38, 139.69], name: 'Tokyo - 12'},
        {latLng: [37.78, -122.41], name: 'San Francisco - 8'},
        {latLng: [28.61, 77.20], name: 'New Delhi - 4'},
        {latLng: [39.91, 116.39], name: 'Beijing - 3'}]
    });
  }

}
