var _SERVER_ADDRESS = "https://thunder.gg/backend/";

//var _appStack = [];
var _profile = {};
var _user_id = 0;
var _session_id = "";
var _userGroups = [];
var _groups = [];


// temp global vars
//var _active_user = 0;

$(document).ready(function() {
    // all custom jQuery will go here

    var username = window.localStorage.getItem("username");
    var password = window.localStorage.getItem("password");

    let loginPromise = new Promise((resolve, reject) => {
        if (username && password) {
            resolve(
                login(username, password, true)
                );
        } else {
            reject(logout(true));
        }
    }); 

    loginPromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above.
      // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
      showEventList();
      console.log("Yay! " + successMessage);

    });

});

function checkSession(username, password) {

    
}

function showLoginModal() {
    $("#loginModal").modal("show");
}

// TO DO: Implement register modal
function showRegisterModal() {
    $("#registerModal").modal("show");
}

function login(username, password, forceLogout) {
    //username = $("#username").val();
    //password = $("#password").val();

    window.localStorage.setItem("username", username);
    $.ajax({
        url: _SERVER_ADDRESS + "login.php",
        dataType: "json",
        type: "POST",
        async: true,
        cache: false,
        data: "username=" + username + "&password=" + password,
        success: function (data) {
            console.log(data);

            if (data["success"] > 0) {
                //setIntent("");
                window.localStorage.setItem("password", password);
                
                //alert("login succesfull " + username + "!");
                
                _profile = data["profile"];
                _user_id = _profile["profile"]["user_id"];
                _session_id = data["session_id"];
                
                console.log("_user_id_: " + _user_id);
                console.log("_session_id_: " + _session_id);

                // _profiles[_profile["profile"]["user_id"]] = _profile;
                //_active_user = _user_id;
                //_appStack = [];

                $("#navbarUser").html("<li class='nav-item nav-link'>" + username + "</li><li class='nav-item'><a class='nav-link' onclick='logout()'>Logout</a></li>");
            }
            else {
                if (forceLogout == true) {
                    logout();
                }
            }
        },
        error: function (data) {

            console.log(data);
            
            if (forceLogout == true) {
                logout();
            }
        }
    });
}

function logout() {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    //$("#user").text("");
    $("#navbarUser").html("<li class='nav-item'><a class='nav-link' href='#' data-toggle='modal' data-target='#registerModal'>Register</a></li><li class='nav-item'><a class='nav-link' onclick='showLoginModal()'>Log in</a></li>");
    // setLayout("layouts/esportsbetting.html");

    _profile = {};
    _user_id = 0;
    _session_id = "";
    _userGroups = [];
}


// EVENTS
function showEventList() {
    if (_userGroups.length == 0) {
        // TO DO: SHOW LOADING
        getEventList();
    } else {
        if ($("#eventList").html() == "") {
            buildEventList();
        }
    }
}

function getEventList() {
    $.ajax({
        url: _SERVER_ADDRESS + 'getGroups.php?user_id=' + _user_id + '&session_id=' + _session_id,
        dataType: 'json',
        type: 'GET',
        async: true,
        cache: false,
        success: function (data) {
            console.log(data);
            if (data["success"] > 0) {
                _userGroups = data["groups"];
                for (var i = 0; i < _userGroups.length; i++) {
                    _groups[_userGroups[i]["group_id"]] = _userGroups[i];
                }
                buildEventList();
            }
            else {
                //alert("alert1: " + data["message"]);
                //showError(data["message"]);
            }
        },
        error: function (data) {
            console.log(data);
            //alert("alert2: " + data["message"]);
            //showError("Failed to fetch groups");
        }
    });
}

function buildEventList() {
    $("#eventList").html("");
    for (var i = 0; i < _userGroups.length; i++) {
        
        var imgsrc = "assets/img/example/image-cdb7d823e2cb9e3c6917605edf62d86a.png";
        //var imgsrc = 'images/avatars/' + ((_userGroups[i]["group_id"] % 56) + 1) + '.svg';
        
        if (_userGroups[i]["picture"] > 0) {
            imgsrc = 'https://thunder.gg/backend/Images/' + _userGroups[i]["picture"] + '.png';
        }
        // var groupStatus = "";
        // if (_userGroups[i]["status"] == 0) {
        //     groupStatus = "UPCOMING";
        // } else if (_userGroups[i]["status"] == 1) {
        //     groupStatus = "IN PROGRESS";
        // } else {
        //     groupStatus = "FINISHED";
        // }

        var tempDate = new Date(_userGroups[i]["start_datetime"]);
        var groupname = _userGroups[i]["name"];
        // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $("#eventList").append("<li><div><img class='avatar' src='" + imgsrc + "'><span>" + groupname + "</span></div></li>");
        //$("#eventList").append("<div id='group_" + _userGroups[i]["group_id"] + "' class='container event-list-container' onclick='selectGroup(" + _userGroups[i]["group_id"] + ")'><div class='row'><div class='col card-event'><div class='thumbnail float-left' style='background: url(" + imgsrc + ") no-repeat center center; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;'></div><div class='col card-event'><h2><a>" + _userGroups[i]["name"] + "</a></h2><small><span class='thunder-green'>" + tempDate.getDate() + " " + months[tempDate.getMonth()] + " " + tempDate.getFullYear()+"</span> | "+groupStatus+"</small></div></div></div></div>");
    }
}
