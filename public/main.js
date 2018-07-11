$(() => {
  
  var socket = io();

  $textarea = $('textarea');
  $form = $('form');
  $box = $('.box');
  $list = $('.list');

  $('.login button').on('click', () => {
    login();
  });
  $('.login input').keypress((e) => {
    if(e.charCode === 13) login();      
  });
  
  function login() {
    if($('.login input').val() === '') {
      $('.login .warning').show();
    }else{
      socket.emit('login', $('.login input').val());
      $('.login').hide();
      $('.container').css('display', 'flex');
      $('textarea').focus();
    }
  }

  socket.on('login', (username, userid) => {
    let $message = $(`<p class="sysM">${username} has joined this room</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);    
    $list.append(`<p class="sysM" data-username="${userid}">${username}</p>`);
  });
  socket.on('logout', (username, userid) => {
    let $message = $(`<p class="sysM">${username} has left this room</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);    
    $list.find(`.sysM[data-username='${userid}']`).remove();
  });

  $form.keypress((e) => {
    if($textarea.val() === '\n') $textarea.val('');    
    if(e.charCode === 13 && $textarea.val() !== '') $form.submit();      
  });
  
  $form.submit((e) => {
    e.preventDefault();
    if($textarea.val() !== ''){
      socket.emit('send message', $textarea.val());
      $textarea.val('');
      return false;
    }
  });

  socket.on('my message', (username, msg) => {
    msg = msg.replace('<', '&#60').replace('>', '&#62');
    let d = new Date();    
    let time = `${d.toLocaleTimeString().substring(0,5)}`;
    let $message = $(`<p class='preM myM'>${username} | ${time}</p><p class='myM message'>${msg}</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);    
    $('textarea').focus();
  });

  socket.on('others message', (username, msg) => {
    msg = msg.replace('<', '&#60').replace('>', '&#62');
    let d = new Date();    
    let time = `${d.toLocaleTimeString().substring(0,5)}`;
    let $message = $(`<p class='preM otherM'>${username} | ${time}</p><p class='otherM message'>${msg}</p>`);
    $box.append($message);
    $box.stop().animate({scrollTop: $box.scrollTop() + $message.offset().top}, 600);
  });
});
