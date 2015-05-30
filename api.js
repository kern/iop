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

exports.robotBreakdown = function (robot, res) {
  res = res || function() {}
  request({
    method: "POST",
    uri: 'http://52.28.33.220:3000/vehicle/v2/IOP0' + (robot + 1),
    headers: headers,
    body: {
      engine: "FAILURE"
    },
    json: true
  }, function (err, httpResponse, body) {
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
}

exports.robotFix = function (robot, res) {
  res = res || function() {}
  request({
    method: "POST",
    uri: 'http://52.28.33.220:3000/vehicle/v2/IOP0' + (robot + 1),
    headers: headers,
    body: {
      engine: "OK"
    },
    json: true
  }, function (err, httpResponse, body) {
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
}
