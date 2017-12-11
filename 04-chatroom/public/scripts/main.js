$(function () {
    var socket = io();
    var emailID = '';
    $('#messages').append($('<li>').text('Welcome to the chat!'));
    function loadMessages(data, scrollH){
        if(JSON.parse(data[0])["email"]==emailID){
            $('#messages').append($('<li>').html('<span class="currentUser">'+JSON.parse(data[0])["user"]+"</span> : "+JSON.parse(data[0])["msg"]));
        }
        else{
            $('#messages').append($('<li>').text(JSON.parse(data[0])["user"]+" : "+JSON.parse(data[0])["msg"]));
        }
        if(scrollH <0){
            $('.chatArea').scrollTop($('#messages')[0].scrollHeight);
        }
    }

    //Form submit for chatting
    $('form').submit(function(event){
        event.preventDefault();
        if($('#m').val()=="/clear"){
            $('#messages').empty();
        }
        else if($('#m').val()){
            socket.emit('chat message', $('#m').val());
        }
        $('#m').val('');
        return false;
    });
    socket.on('redirect', function(destination) {
        window.location.href = destination;
    });
    socket.on('email id', function(data) {
        emailID = data;
        //console.log(emailID);
    });
    socket.on('user data',function(data){
        //console.log(data);
        $('.userNumber').html(data.numberOfUsers+" <img style='height:15px' src='images/icons8-customer-48.png'>");
        $('#users').empty();
        $('#users').append($('<li>').text(`${data.numberOfUsers} user${data.numberOfUsers==1?"":"s"} in chat.`));
        for(var i in data.users){
            $('#users').append($('<li>').text(data.users[i]));
        }
    })

    //Update websocket after chat message
    socket.on('chat message', function(data){
        //let scrollH = $('.chatArea').scrollTop();
        let scrollH = $('#messages')[0].scrollHeight - $('.chatArea').scrollTop()-$('.chatArea')[0].clientHeight;
        //$('#messages').empty();
        loadMessages(data,scrollH);
    });
});