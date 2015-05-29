var request = require('request');

var baseURL = 'http://tmforum-test.apigee.net/orionlabfi-ware/version/'
var token   = 'MRiEY85d9xqsDRMMymRPBr36T9B3kX'
var headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json'
}

exports.createIncident = function (message, nxt) {
    // creating an incident
    var cont = false
    if (typeof message == 'object') {
        if (message.severity == undefined) {
            message.severity = 'Middle'
        }
        if (message.type == undefined) {
            message.type = 'cleanup'
        }
        if (message.description != undefined) {
            cont = true
        }
    }
    if cont {
        request({
            method:     'POST',
            uri:        baseURL + 'troubleTicket',
            headers:    headers,
            formData:   {
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
            }
        })
    } else {
        // error

    }

}