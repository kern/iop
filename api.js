var request = require('request')

var baseURL = 'http://env-0693795.jelastic.servint.net/'
var token   = 'MRiEY85d9xqsDRMMymRPBr36T9B3kX'
var headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json'
    // 'Auth-token':   token
}

exports.createIncident = function (message, res) {
    // creating an incident
    var cont = false
    if (typeof message == 'object') {
        if (message.severity == undefined) {
            message.severity = 'High'
        }
        if (message.type == undefined) {
            message.type = 'cleanup'
        }
        if (message.description != undefined) {
            cont = true
        }
    }
    if (cont) {
        request({
            method:     'POST',
            uri:        baseURL + 'DSTroubleTicket/api/troubleTicketManagement/v2/troubleTicket',
            headers:    headers,
            body: {
                "description":  message.description,

                "severity":     message.severity,
                "type":         message.type,
                // "creationDate": (new Date()).toISOString(),
                // "targetResolutionDate": (new Date() + message.resolveTime).toISOString(),
                "status": "Submitted",
                "relatedParty": [
                ],
                "relatedObject": [
                ],
                "note": [
                ]
            },
            json: true
        }, function(err, httpResponse, body) {
            if (err) {
                res({
                    success: false,
                    reason: 'http_error'
                })
            } else {
                res({
                    success: true,
                    httpResponse: httpResponse,
                    body: body
                })
            }
        })
    } else {
        // error
        res({
            success: false,
            reason: 'bad_input'
        })
    }

}