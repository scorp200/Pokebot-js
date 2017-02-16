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
        if (b.players[0].id == pid1 || b.players[1].id == pid1) {
            msg.reply('```You are already in a battle!```');
            return;
        }
        if (b.players[0].id == pid2 || b.players[1].id == pid2) {
            msg.reply('```They are already in a battle!```');
            return;
        }
    }

    var p1 = new modules['player'](pid1, undefined, modules['utils'].get_random_range(guild_room.get_settings().hp_range.min, guild_room.get_settings().hp_range.max), modules['utils'].get_random_type());
    var p2 = new modules['player'](pid2, undefined, modules['utils'].get_random_range(guild_room.get_settings().hp_range.min, guild_room.get_settings().hp_range.max), modules['utils'].get_random_type());
    var bid = p1.id + '' + p2.id;
    guild_room.get_battles()[bid] = new modules['battle'](bid, msg.channel, p1, p2);;
}
