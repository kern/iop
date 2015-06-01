var request = require('request')

var baseURL = 'http://orion.lab.fiware.org:1026/'
var token = 'YLbvKRRIrC6IlEITbc5S9MDbB7uY2U'
var headers = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-Auth-Token': token
}

function makeRequest(resource, body, callback) {
  callback = callback || function () {}
  return request({
    method: 'POST',
    uri: baseURL + resource,
    headers: headers,
    json: true,
    body: body || {}
  }, callback)
}

exports.createRequest = function (id, attrs, callback) {
  callback = callback || function () {}
  return makeRequest('v1/contextEntities/urn:iop:trash' + id, {
    attributes: [{
      name: 'full',
      type: 'boolean',
      value: 'false'
    }]
  }, function (err, res, body) {
    callback(res)
  })
}

exports.queryRequest = function (id, callback) {
  callback = callback || function () {}
  return makeRequest('v1/queryContext', {
    entities: [{
      id: 'urn:iop:trash' + id,
      isPattern: "false"
    }]
  }, function (err, res, body) {
    callback(body.contextResponses[0].contextElement.attributes[0].value === 'true')
  })
}

exports.updateRequest = function (id, value, callback) {
  callback = callback || function () {}
  return makeRequest('v1/updateContext', {
    updateAction: 'UPDATE',
    contextElements: [{
      isPattern: 'false',
      id: 'urn:iop:trash' + id,
      attributes: [{
        name: 'full',
        type: 'boolean',
        value: value
      }]
    }]
  }, function (err, res, body) {
    callback(body)
  })
}
