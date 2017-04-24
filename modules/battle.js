module.exports = function(id, channel, players, damage_range, crit_rate) {
    return {
        id: id,
        timer: 0,
        channel: channel,
        state: 0,
        turn: 0,
        players: players,
        damage_range: damage_range,
        crit_rate: crit_rate
    }
};
