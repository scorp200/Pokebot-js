module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkchallenge',
        name: 'challenge',
        help: 'Help: !pkchallenge @user | challenge the mentioned user.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, challenge);
}

function challenge(msg, text, guild_room, player_stats, modules) {
    if (!msg.mentions.users.first()) {
        msg.reply('``` Invalid player ```');
        return;
    }

    var pid1 = msg.member.user.id;
    var pid2 = msg.mentions.users.first().id;

    for (var bid in guild_room.get_battles()) {
        var b = guild_room.get_battles()[bid];
        if (b.players[pid1]) {
            msg.reply('```You are already in a battle!```');
            return;
        }
        if (b.players[pid2]) {
            msg.reply('```They are already in a battle!```');
            return;
        }
    }

    var p1 = new modules['player'](pid1, undefined, modules['utils'].get_random_range(guild_room.get_settings().hp_range.min, guild_room.get_settings().hp_range.max), modules['utils'].get_random_type());
    var p2 = new modules['player'](pid2, undefined, modules['utils'].get_random_range(guild_room.get_settings().hp_range.min, guild_room.get_settings().hp_range.max), modules['utils'].get_random_type());
    var players = {};
    players[pid1] = p1;
    players[pid2] = p2;
    var bid = p1.id + '' + p2.id;
    guild_room.get_battles()[bid] = new modules['battle'](bid, msg.channel, players, {
        min: guild_room.get_settings().damage_range.min,
        max: guild_room.get_settings().damage_range.max
    }, guild_room.get_settings().crit_rate);
    guild_room.get_battles()[bid].state = 1;
    console.log("Room:" + guild_room.get_settings().id + " Challenge: " + pid1 + " vs " + pid2 + " id: " + bid);
    msg.channel.sendMessage('<@' + pid1 + '> challenged <@' + pid2 + '>');
}
