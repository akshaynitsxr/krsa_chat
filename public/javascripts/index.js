$(document).ready(function() {
    $('button.oauth').click(function(e) {
        // $.ajax({
        //     type: 'POST',
        //     url: 'https://github.com/login/oauth/authorize?client_id=469635ab39aa6f711f22&redirect_uri=http://localhost:8001/dashboard/&response_type=code&scope=user'
        // })
        window.location.assign('http://github.com/login/oauth/authorize?client_id=469635ab39aa6f711f22&redirect_uri=http://localhost:8001/loading/&response_type=code&scope=user', "width=560,height=315")
        // $.ajax({
        //     type: 'POST',
        //     url: 'https://github.com/login/oauth/authorize?client_id=469635ab39aa6f711f22&redirect_uri=http://localhost:8001/dashboard/&response_type=code&scope=user'
        // })
    });
})