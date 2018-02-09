import {Injectable} from '@angular/core';

@Injectable()
export class DashboardService {

  constructor() {
  }

  public getTime() {

    this.tp_clock();
    this.tp_date();


    // return {
    //   init: function () {
    //     this.tp_clock();
    //     this.tp_date();
    //   }
    // };
  }

  // templatePlugins.init();

  /* END Vector Map */
  public tp_clock() {

    function tp_clock_time() {
      const now     = new Date();
      let hour    = now.getHours();
      let minutes = now.getMinutes();

      hour = hour < 10 ? 0 + hour : hour;
      minutes = minutes < 10 ? 0 + minutes : minutes;

      $('.plugin-clock').html(hour + "<span id='blink'> : </span>" + minutes);
    }
    if ($('.plugin-clock').length > 0) {

      tp_clock_time();

      window.setInterval(function(){
        tp_clock_time();
      }, 10000 );

    }
  }

  public tp_date () {

    if ($('.plugin-date').length > 0) {

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

      const now = new Date();
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();

      $('.plugin-date').html(day + ', ' + month + ' ' + date + ', ' + year);
    }

  }


}
