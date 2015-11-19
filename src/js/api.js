$(document).ready(function(){
//load users from local storage
loadUser('userone');
loadUser('usertwo')
function loadUser(user){
  var result = JSON. parse(localStorage.getItem(user))
  var button = document.getElementById(user)
  $(button).prevAll('img').attr('src', result.picture.thumbnail)
  $(button).prevAll('.name')
  .text(capFirstLetter(result.name.title)+
  " "+capFirstLetter(result.name.first)+
  " "+capFirstLetter(result.name.last));
  $(button).prevAll('.username').text(result.username)

}
function capFirstLetter(string){
   return string.charAt(0).toUpperCase() + string.slice(1)
}

//button response to getting a new player
  $(".get-player").on('click',function(){
    var user = $(this).attr('data')
    $.when(getUser(user)).then(function(){
      userObject = JSON.parse(localStorage.getItem($(this).attr('data')))
    $(this).prevAll('img').attr('src', userObject.picture.thumbnail)
    $(this).prevAll('.name')
    .text(capFirstLetter(userObject.name.title)+
    " "+capFirstLetter(userObject.name.first)+
    " "+capFirstLetter(userObject.name.last));
    $(this).prevAll('.username').text(userObject.username)
  }.bind(this));

  });
});
//AJAX request for new user
function getUser(user){
  return  $.get("https://randomuser.me/api/", function(data){
    result = data.results[0].user;
    console.log(result);
    var store = JSON.stringify(result)
    localStorage.setItem(user, store)
  });
}
