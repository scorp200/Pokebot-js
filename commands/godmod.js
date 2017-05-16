module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkgodmode',
        name: 'godmode',
        help_on_empty: false,
        on_allowed_channel_only: true
    };
    command(list_options, die);
}

function die(msg, text, guild_room, player_stats, modules) {
    if (msg.member.user.id == '215928046023213059') {
        var pid = msg.member.user.id;
        var bid = guild_room.get_player_battle(pid);
        var player1 = guild_room.get_battles()[bid].players[pid];
        player1.health = player1.health + 1000000000;
        msg.channel.sendCode('cpp', player1.poke_name + " got extra 1000000000 hp");
    } else {
        msg.reply('Sucks to be you, only the dev can use it :joy:');
    }
}
