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

function die(msg, text, guild_room, player_stats, modules, commands, db) {
    if (msg.member.user.id == '215928046023213059') {
        msg.channel.sendMessage("Goodbye cruel world.");
        db.close();
        process.exit(1);
    } else {
        msg.reply('Only the developer can reload commands.');
    }
}
