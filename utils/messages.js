const moment = require('moment');

function formatMessage(usrname, text) {
    return {
        usrname,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;