$(document).ready(function() {
    var socket = io()
    $('form .msg').click(function() {
        socket.emit('chat message', $('#msg').val());
        $('#msg').val('');
        return false;
    });
    socket.on('chat message', function(data) {
        $('.chat-ul').append('<li class = "clearfix"><span class = "message you-message">' + data.msg + '</span></li>');
        if (data.type === 'giphy') {
            $('.chat-ul').append('<div class="gif"><li class = "clearfix"><img src ="' + data.rendering + '" class= "gifIcon"></img></li></div>');
        } else if (data.type === 'url') {
            $('.chat-ul').append('<div class="url-data"><li class = "clearfix heading"><p>' + data.title + '</p><h6 class=description>' + data.description + '</h6><img src ="' + data.image_url + '" class="imageIcon description"></img></li></div>')
        }
    })
})