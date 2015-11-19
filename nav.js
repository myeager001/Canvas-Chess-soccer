$(document).ready(function(){
  function readURL(input, outputId) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(outputId).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
  }

  $('.sbmt-plyr').on("click",function(event){
    event.preventDefault();
    if($("input[value='white']").is(':checked')){
      readURL(document.getElementById('imgInp'),"#player2")
      $('.player2')
      .next().text($("input[id='name']").val())
      .next().text($("input[id='username']").val())
    }else{
      readURL(document.getElementById('imgInp'),"#player1")
      $('.player1')
      .next().text($("input[id='name']").val())
      .next().text($("input[id='username']").val())
    }

  })
  $('.save').on('click', function(){
    var saveName = prompt('Name Game to Save')
    saveGame(saveName);

  })

  $('.load').on('click', function(){
    var loadName = prompt('Name of Game')
    loadGame(loadName);
  })


})
