module.exports = function(id, channel, players, damage_range, crit_rate) {
    this.id = id;
    this.timer = 0;
    this.channel = channel;
    this.state = 0;
    this.turn = 0;
    this.players = players;
    this.damage_range = damage_range;
    this.crit_rate = crit_rate
}
