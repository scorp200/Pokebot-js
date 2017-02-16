module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkaddchannel',
        name: 'addchannel',
        help: '!pkaddchannel add the current channel to whitelist.',
        help_on_empty: true
    };
    command(list_options, add_channel);
}

function add_channel(msg, text, guild_room) {
    msg.mentions.channels.array().forEach(function(channel) {
        guild_room.get_settings().channel_list[channel.id] = true;
        console.log('Guild:' + guild_room.get_settings().id + ' added channel:' + channel.id + ' to the whitelist');
    });
    msg.reply("```this channel has been added to the whitelist.```")
}
