const request = require("request");
const helpers = require("../helpers/helpers.js");

function busCommand (bot, args, receivedMessage) {
    if (args.length === 0) {
        helpers.argumentsUsedExample(bot, receivedMessage, "stop", "!bus 7571");
    }
    else if (args.length > 0) {
        request.post({
            url:     "https://faas.jamesmcdermott.ie/function/transport",
            body:    "127.0.0.1:8000/bus/stop/" + args
        },
        function(error, response, body) {
            const {departures: buses} = JSON.parse(body);
            let schedule = "";
            for(const n in buses){
                const parsed = busParseTime(buses[n].MonitoredCall_ExpectedArrivalTime
                    .substring(11, 16)
                    .split(":"));
                const timeTo = busGetTimeTo(parsed[0], parsed[1], parsed[2], parsed[3]);

                const {
                    MonitoredVehicleJourney_PublishedLineName: LineName,
                    MonitoredVehicleJourney_DestinationName: DestinationName
                } = buses[n];

                schedule +=
                    `${LineName} (${DestinationName}) - ${timeTo}\n`;
            }

            receivedMessage.author.send(helpers.embedify(bot, schedule))
                .catch(err => console.trace(`Exception occurred in sending message ${err}`));
        });
    }
}

function busParseTime (arr) {
    const date = new Date(); const h = date.getHours(); const m = date.getMinutes();
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

module.exports = {
    busCommand: function() {  }
};
