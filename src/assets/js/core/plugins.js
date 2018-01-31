// //Tagsinput
// var feTagsinput = function(){
//   if($(".tagsinput").length > 0){
//
//     $(".tagsinput").each(function(){
//
//       if($(this).data("placeholder") != ''){
//         var dt = $(this).data("placeholder");
//       }else
//         var dt = 'add a tag';
//
//       $(this).tagsInput({width: '100%',height:'auto',defaultText: dt});
//     });
//
//   }
// }// END Tagsinput
$(function() {
  /* WIDGETS (DEMO)*/
  $(".widget-remove").on("click",function(){
    $(this).parents(".widget").fadeOut(400,function(){
      $(this).remove();
      $("body > .tooltip").remove();
    });
    return false;
  });
  /* END WIDGETS */

  var templatePlugins = function(){

    var tp_clock = function(){

      function tp_clock_time(){
        var now     = new Date();
        var hour    = now.getHours();
        var minutes = now.getMinutes();

        hour = hour < 10 ? '0'+hour : hour;
        minutes = minutes < 10 ? '0'+minutes : minutes;

        $(".plugin-clock").html(hour+"<span>:</span>"+minutes);
        $(".plugin-clock span").css({"-webkit-animation":" pulsate 1s ease-out",
        "-webkit-animation-iteration-count": "infinite",
        "-moz-animation": "pulsate 1s ease-out",
        "-moz-animation-iteration-count": "infinite",
        "animation": "pulsate 1s ease-out",
        "animation-iteration-count": "infinite",
        "margin-right": "2px"})
      }
      if($(".plugin-clock").length > 0){

        tp_clock_time();

        window.setInterval(function(){
          tp_clock_time();
        },10000);

      }
    }

    var tp_date = function(){

      if($(".plugin-date").length > 0){

        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        var now     = new Date();
        var day     = days[now.getDay()];
        var date    = now.getDate();
        var month   = months[now.getMonth()];
        var year    = now.getFullYear();

        $(".plugin-date").html(day+", "+month+" "+date+", "+year);
      }

    }

    return {
      init: function(){
        tp_clock();
        tp_date();
      }
    }
  }();

  templatePlugins.init();

  var jvm_wm = new jvm.WorldMap({container: $('#dashboard-map-seles'),
    map: 'world_mill_en',
    backgroundColor: '#FFFFFF',
    regionsSelectable: true,
    regionStyle: {selected: {fill: '#B64645'},
      initial: {fill: '#33414E'}},
    markerStyle: {initial: {fill: '#1caf9a',
      stroke: '#1caf9a'}},
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
  /* END Vector Map */
});
