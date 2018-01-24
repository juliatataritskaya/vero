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
  $('#rooms').tagsinput({
    maxTags: 3
  });
});
