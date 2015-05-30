var reportTrash = function (location) {
    socket.emit('createIncident', {
        description: 'trash',
        location: location
    },
    function (res) {
        console.log(res)
    });
}