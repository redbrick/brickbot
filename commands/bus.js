var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    busCommand: function (bot, args, receivedMessage) {
        if (args.length == 0) {
            helpers.argumentsUsedExample(receivedMessage, "stop", "!bus 7571");
            return;
        }
        else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/transport",
                body:    "127.0.0.1:8000/bus/stop/" + args
            }, 
            function(error, response, body) {
                var buses = JSON.parse(body).departures;
                var schedule = "";
                for(var n in buses){
                    var parsed = busParseTime(buses[n].MonitoredCall_ExpectedArrivalTime.substring(11, 16).split(":"));
                    var timeTo = busGetTimeTo(parsed[0], parsed[1], parsed[2], parsed[3]);
                    schedule += (buses[n].MonitoredVehicleJourney_PublishedLineName + " (" + buses[n].MonitoredVehicleJourney_DestinationName + ") - " + timeTo + "\n");
                }
                receivedMessage.channel.send(helpers.embedify(bot, schedule));
            });
        } 
    },
};

function busParseTime (arr) {
    var date = new Date(); var h = date.getHours(); var m = date.getMinutes();
    return [parseInt(arr[0]), h, parseInt(arr[1]), m];
}

function busGetTimeTo(hr, h, min, m) {
    var hour = hr - h - 2;
    var minute;
    var timeTo;
    if (min - m < 0){
        minute = 60 + (min - m);
    } else {
        minute = min - m;
    }
    if (hour <= 0 && minute == 0) {
        timeTo = "Due";
    } else if (hour <= 0) {
        timeTo = minute + " mins";
    } else {
        timeTo = hour + " hr " + minute + " mins";
    }
    return timeTo;
}
