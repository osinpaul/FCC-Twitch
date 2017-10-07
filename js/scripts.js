let channels = ["freecodecamp", "riotgames"];
let clientId = 'c8a3wkkb56yqjhlcui7tcfyjvs65dy6'; //from FCC forum

const makeURL = (channel) => {
    return 'https://api.twitch.tv/kraken/streams/' + channel + '?client_id=' + clientId;
};

const makeHTML = (image, chName, created, viewers, description, href, status) => { //html constructor
    return '<div class="row" id="' + status + '"><div class="col-md-3"><div id="icon" class="col-md-12"><img class="img-responsive" src ="' + image + '" /></div></div><div class="col-md-9"><div class="col-md-12 chname"><a href="' + href + '" target="_blank">' + chName + ' <i class="fa fa-video-camera" aria-hidden="true"></i></a></div><div class="col-md-12 date">' + created + ' <i class="fa fa-calendar" aria-hidden="true"></i></div><div class="col-md-12 users">' + viewers + ' <i class="fa fa-users" aria-hidden="true"></i></div><div class="col-md-12 descr">' + description + ' <i class="fa fa-book" aria-hidden="true"></i></div><div id="isOnline">The channel is temporary offline</div></div><div>';
};

const numFomat = date => {
    return (date < 10) ? '0' + String(date) : date;
}

const isNull = input => {
    return (input === null);
}

const disableButtons = () => {
    $("#all").removeClass("active");
    $("#live").removeClass("active");
    $("#dead").removeClass("active");
};


const dateConvert = date => {
    date = new Date(date); //constructor of date
    let num = numFomat(date.getDate());
    let month = numFomat(date.getMonth());;
    let year = Number(date.getYear()) + 1900; //отсчет с 1900 года :)
    let hours = numFomat(date.getHours());
    let minutes = numFomat(date.getMinutes());
    return num + '.' + month + '.' + year + ', ' + hours + ':' + minutes;
};

function getChannelInfo() {
    channels.forEach(function (channel) {
        //console.log(makeURL(channel));

        $.getJSON(makeURL(channel), function (data) {
            //console.log((data.stream === null)? 'empty' : data.stream.channel.logo);
            let game,
                status;
            if (data.stream === null) {
                game = "Offline";
                status = "offline";
            } else if (data.stream === undefined) {
                game = "Account Closed";
                status = "offline";
            } else {
                game = data.stream.game;
                status = "online";
            };

            $.getJSON(makeURL(channel), function (data) {
                let logo = (isNull(data.stream)) ? "https://dummyimage.com/100/d9d9d9/000000.png&text=++NO+IMAGE" : data.stream.channel.logo;
                let chName = data.display_name != null ? data.display_name : channel;
                let viewers = (isNull(data.stream)) ? '' : data.stream.viewers;//
                let created = (isNull(data.stream)) ? '' : dateConvert(data.stream.created_at);//
                let chStatus = (isNull(data.stream)) ? '' : data.stream.channel.status;
                let href = (isNull(data.stream)) ? '' : data.stream.channel.url;
                let description = status === "online" ? ': ' + data.status : "";

                html = makeHTML(logo, chName, created, viewers, chStatus, href, status);

                status === "online" ? $("#display").prepend(html) : $("#display").append(html);
            });
        });
    });
};

$(document).ready(function () {
    getChannelInfo();

    $("#all").click(function () {
        disableButtons();
        $(this).addClass("active");
        $("#online").removeClass("hidden");
        $("#offline").removeClass("hidden");
    })

    $("#live").click(function () {
        disableButtons();
        $(this).addClass("active");
        $("#online").removeClass("hidden");
        $("#offline").addClass("hidden");
    })

    $("#dead").click(function () {
        disableButtons();
        $(this).addClass("active");
        $("#online").addClass("hidden");
        $("#offline").removeClass("hidden");
    })


});

