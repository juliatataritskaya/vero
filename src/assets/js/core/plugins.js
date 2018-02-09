// $(function() {
//   var templatePlugins = function(){
//
//     var tp_clock = function(){
//
//       function tp_clock_time(){
//         var now     = new Date();
//         var hour    = now.getHours();
//         var minutes = now.getMinutes();
//
//         hour = hour < 10 ? '0'+hour : hour;
//         minutes = minutes < 10 ? '0'+minutes : minutes;
//
//         $(".plugin-clock").html(hour+"<span id='blink'>:</span>"+minutes);
//       }
//       if($(".plugin-clock").length > 0){
//
//         tp_clock_time();
//
//         window.setInterval(function(){
//           tp_clock_time();
//         },10000);
//
//       }
//     }
//
//     var tp_date = function(){
//
//       if($(".plugin-date").length > 0){
//
//         var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
//         var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//
//         var now     = new Date();
//         var day     = days[now.getDay()];
//         var date    = now.getDate();
//         var month   = months[now.getMonth()];
//         var year    = now.getFullYear();
//
//         $(".plugin-date").html(day+", "+month+" "+date+", "+year);
//       }
//
//     }
//
//     return {
//       init: function(){
//         tp_clock();
//         tp_date();
//       }
//     }
//   }();
//
//   templatePlugins.init();
//
//   /* END Vector Map */
// });
