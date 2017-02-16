module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pkchallenge',
        name: 'challenge',
        help: '!pkchallenge @user | challenge the mentioned user.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, challenge);
}

function challenge(msg, text, guild_room, player_stats) {
        var player = msg.mentions.users.first();
        if (player == undefined) {
            msg.reply('``` Invalid player ```');
            return;
        }
}
