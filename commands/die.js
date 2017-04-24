module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkdie',
        name: 'die',
        help_on_empty: false,
        on_allowed_channel_only: true
    };
    command(list_options, die);
}

function die(msg, text, guild_room, player_stats, modules) {
    msg.channel.sendMessage("Goodbye cruel world.");
    throw new Error("I am dead.");
}
