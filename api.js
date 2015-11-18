$(document).ready(function(){

  $(".get-player").on('click',function(){
    $.when(getUser()).then(function(){
      userObject = JSON.parse(localStorage.getItem('user'))
    $(this).prevAll('img').attr('src', userObject.picture.thumbnail)
    $(this).prevAll('.name')
    .text(userObject.name.title.toUpperCase()+
    " "+userObject.name.first.toUpperCase()+
    " "+userObject.name.last.toUpperCase());
    $(this).prevAll('.username').text(userObject.username)
  }.bind(this));

  });
});
function getUser(){
  return  $.get("https://randomuser.me/api/", function(data){
    result = data.results[0].user;
    console.log(result);
    var store = JSON.stringify(result)
    localStorage.setItem('user', store)
  });
}
