var request = require('request')

var baseURL = 'http://env-0693795.jelastic.servint.net/'
var token   = 'MRiEY85d9xqsDRMMymRPBr36T9B3kX'
var headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json'
    // 'Auth-token':   token
}

var troubleTicket = baseURL + "DSTroubleTicket/api/troubleTicketManagement/v2"

exports.createIncident = function (trashId, res) {
    request({
        method:     'POST',
        uri:        troubleTicket + '/troubleTicket',
        headers:    headers,
        body: {
            "description":  "trash",

            "severity":     "High",
            "type":         'trashcan',
            // "creationDate": (new Date()).toISOString(),
            // "targetResolutionDate": (new Date() + message.resolveTime).toISOString(),
            "status": "Submitted",
            "relatedParty": [
            // {
            //     trashId: trashId
            // }
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
                reason: 'http_error',
                httpResponse: httpResponse,
                body: body,
                err: err
            })
        } else {
            res({
                success: true,
                httpResponse: httpResponse,
                body: body
            })
        }
    })
}

exports.fixIncident = function (ticket, res) {
    var url = troubleTicket + '/troubleTicket/' + ticket
    // fixing callback hell
    request({
        method:     "PATCH",
        uri:        url,
        headers:    headers,
        body: {
            status: "Acknowledged",
            statusChangeReason: "Robot saw it"
        },
        json: true
    }, function(resp) {
        request({
            method:     "PATCH",
            uri:        url,
            headers:    headers,
            body: {
                status: "InProgress",
                statusChangeReason: "Robot reached it"
            },
            json: true
        }, function(resp) {
            request({
                method:     "PATCH",
                uri:        url,
                headers:    headers,
                body: {
                    status: "Resolved",
                    statusChangeReason: "Robot fixed the trash"
                },
                json: true
            }, res)
        })
    })
}

exports.carBreakdown = function (message, res) {
    console.message('carBreakdown')
    if (message.carId != undefined) {
        request({

        }, function (err, httpResponse, body) {
            if (err) {
                res({
                    success: false,
                    reason: 'http_error',
                    endpoint: 'carBreakdown'
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
        res({
            success: false,
            reason: 'no_car'
        })
    }
}






