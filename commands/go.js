module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkgo',
        name: 'go',
        help: 'Help: !go name | choose a pokemon with specified name.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, go);
}

function go(msg, text, guild_room, player_stats, modules) {
    var pid = msg.member.user.id;
    var bid = guild_room.get_player_battle(pid);
    if (!bid || guild_room.get_battles()[bid].state != 1 || guild_room.get_battles()[bid].players[pid].poke_name != undefined)
        return;
    var index = msg.content.indexOf(' ');
    if (index == -1)
        return true;
    var poke_name = msg.content.substring(index, text.length).trim();
    guild_room.get_battles()[bid].players[pid].poke_name = poke_name;
    console.log('Room:' + guild_room.get_settings().id + ' Player: ' + pid + ` | ` + poke_name + ' | ' + guild_room.get_battles()[bid].players[pid].health + ' | ' + guild_room.get_battles()[bid].players[pid].type);
    msg.channel.sendMessage('<@' + pid + '>');
    msg.channel.sendCode('cpp', 'chose ' + poke_name + ' with ' + guild_room.get_battles()[bid].players[pid].health + ' hp and type ' + guild_room.get_battles()[bid].players[pid].type)
    for (var pid2 in guild_room.get_battles()[bid].players) {
        if (pid2 == pid)
            continue;
        if (guild_room.get_battles()[bid].players[pid2].poke_name)
            guild_room.get_battles()[bid].state = 2;
    }
}
