$(() => {
  //initialize socket.io  
  var socket = io();

  $textarea = $('textarea');
  $form = $('form');
  $box = $('.box');
  $list = $('.list');

  //decided username and login
  $('.login button').on('click', () => {
    login();
  });
  $('.login input').keypress((e) => {
    if(e.charCode === 13) login();      
  });
  
  function login() {
    //invalid username(empty) handling
    if($('.login input').val() === '') {
      $('.login .warning').show();
    }else{
      //emit login event and send username to server
      socket.emit('login', $('.login input').val());
      //hide login page, show chatroom
      $('.login').hide();
      $('.container').css('display', 'flex');
      $('textarea').focus();
    }
  }

  //boradcast login message
  socket.on('login', (username, userid) => {
    let $message = $(`<p class="sysM">${username} has joined this room</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);    
    //add username to sidebar
    $list.append(`<p class="sysM" data-username="${userid}">${username}</p>`);
  });
  //broadcast logout message
  socket.on('logout', (username, userid) => {
    let $message = $(`<p class="sysM">${username} has left this room</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600); 
    //remove username from sidebar   
    $list.find(`.sysM[data-username='${userid}']`).remove();
  });

  //send message by enter
  $form.keypress((e) => {
    if($textarea.val() === '\n') $textarea.val('');    
    if(e.charCode === 13 && $textarea.val() !== '') $form.submit();      
  });
  
  //send message
  $form.submit((e) => {
    e.preventDefault();
    if($textarea.val() !== ''){
      socket.emit('send message', $textarea.val());
      $textarea.val('');
      return false;
    }
  });

  //recieve message from server as my message
  socket.on('my message', (username, msg) => {
    msg = msg.replace('<', '&#60').replace('>', '&#62');
    let d = new Date();    
    let time = `${d.toLocaleTimeString().substring(0,5)}`;
    let $message = $(`<p class='preM myM'>${username} | ${time}</p><p class='myM message'>${msg}</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);    
    $('textarea').focus();
  });
  //recieve message from server as others message
  socket.on('others message', (username, msg) => {
    msg = msg.replace('<', '&#60').replace('>', '&#62');
    let d = new Date();    
    let time = `${d.toLocaleTimeString().substring(0,5)}`;
    let $message = $(`<p class='preM otherM'>${username} | ${time}</p><p class='otherM message'>${msg}</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);
  });
});
