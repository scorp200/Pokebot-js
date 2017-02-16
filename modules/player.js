module.exports = function(player, poke, hp, type) {
    return {
        id: player,
        poke_name: poke,
        health: hp,
        type: type,
        max_health: hp
    }
};
