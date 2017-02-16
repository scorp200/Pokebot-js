module.exports = function(id, channel, p1, p2) {
    return {
        id: id,
        timer: 0,
        channel: channel,
        state: 0,
        turn: 0,
        players: [p1, p2]

    }
};
