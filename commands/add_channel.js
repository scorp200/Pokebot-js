module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkaddchannel',
        name: 'addchannel',
        help: 'Help: !pkaddchannel #channel | restrict players to the specified channels only',
        help_on_empty: true
    };
    command(list_options, add_channel);
    list_options = {
        command: 'pkrestrict',
        name: 'restrict',
        help: 'Help: !restrict | toggles deletion of messages that are not commands',
        on_allowed_channel_only: true
    };
    command(list_options, toggle_restrict);
    list_options = {
        command: 'removemessages',
        name: 'removemessages',
        help: 'Help: removes messages',
        on_allowed_channel_only: true,
        pre_command: true
    };
    command(list_options, remove_messages);
}

function remove_messages(msg, text, guild_room, player_stats, modules, commands) {
    var settings = guild_room.get_settings();
    if (msg.author.bot || !settings.channel_list[msg.channel.id])
        return;
    if (settings.restrict) {
        if (text[0] != '!')
            msg.delete();
        else if (text[0] == '!') {
            var index = text.length;
            if (text.indexOf(' ') > 0)
                index = text.indexOf(' ');
            var command = text.substring(1, index);
            if (commands.listenerCount(command) == 0)
                msg.delete();
        }

    }
}

function add_channel(msg, text, guild_room, player_stats, modules, commands, db) {

    msg.mentions.channels.array().forEach(function(channel) {
        guild_room.get_settings().channel_list[channel.id] = true;
        console.log('Guild:' + guild_room.get_settings().id + ' added channel:' + channel.id + ' to the whitelist');
    });
    var list = JSON.stringify(guild_room.get_settings().channel_list);
    db.run('UPDATE Guilds SET CHANNEL_LIST =\'' + list + '\' WHERE ID ="' + guild_room.get_settings().id + '"');
    msg.reply("```this channel has been added to the whitelist.```")
}

function toggle_restrict(msg, text, guild_room, player_stats, modules, commands, db) {
    var settings = guild_room.get_settings();
    if (settings.restrict) {
        settings.restrict = false;
        msg.reply("```message restriction was turned off.```")
    }
    if (!settings.restrict) {
        settings.restrict = true;
        msg.reply("```message restriction was turned on.```")
    }
    var list = (settings.restrict) ? 1 : 0;
    db.run('UPDATE Guilds SET RESTRICTED =' + list + ' WHERE ID ="' + settings.id + '"');
}
