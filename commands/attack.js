module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkattack',
        name: 'attack',
        help: 'Help: !attack name | use an attack with specified name.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, attack);
}

function attack(msg, text, guild_room, player_stats, modules) {
    function damage(player, damage_range, battle) {
        var type = modules['utils'].get_random_type();
        var crit_mult = ((Math.random() < battle.crit_rate)) ? 2 : 1;
        var damage_mult = modules['utils'].get_damage_mult(type, player.type);
        var damage = Math.floor(modules['utils'].get_random_range(battle.damage_range.min, battle.damage_range.max) * damage_mult * crit_mult);
        player.health -= damage;
        if (damage_mult == 0) {
            msg.channel.sendCode('', player.poke_name + " tried to use " + attack_name + " but failed.");
            return;
        }
        if (damage_mult != 0.5 && crit_mult == 2)
            msg.channel.sendCode('cpp', 'A critical hit!');
        msg.channel.sendCode('', guild_room.get_battles()[bid].players[pid].poke_name + ' used ' + attack_name + ' type ' + type);
        msg.channel.sendCode('cpp', player.poke_name + ' took ' + damage + ' and has ' + player.health + ' health remaining.');
        if (crit_mult == 1 && damage_mult == 0.5)
            msg.channel.sendCode('', "But it wasn't very effective.");
    }
    var pid = msg.member.user.id;
    var bid = guild_room.get_player_battle(pid);
    if (!bid || guild_room.get_battles()[bid].state != 2)
        return;
    var index = msg.content.indexOf(' ');
    if (index == -1)
        return true;
    var attack_name = msg.content.substring(index, text.length).trim();
    var keys = Object.keys(guild_room.get_battles()[bid].players)
    for (var i = 0; i < keys.length; i++) {
        if (i == 0 && guild_room.get_battles()[bid].players[keys[i]].id == pid && guild_room.get_battles()[bid].turn == 0) {
            damage(guild_room.get_battles()[bid].players[keys[1]], guild_room.get_battles()[bid].damage_range, guild_room.get_battles()[bid]);
            guild_room.get_battles()[bid].turn = 1;
            return;
        }
        if (i == 1 && guild_room.get_battles()[bid].players[keys[i]].id == pid && guild_room.get_battles()[bid].turn == 1) {
            damage(guild_room.get_battles()[bid].players[keys[0]], guild_room.get_battles()[bid].damage_range, guild_room.get_battles()[bid]);
            guild_room.get_battles()[bid].turn = 0;
            return;
        }
    }

}
