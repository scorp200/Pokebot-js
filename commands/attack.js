module.exports = {
	init: init
};

function init(command) {
	var list_options = {
		command: 'attack',
		name: 'attack',
		help: 'Help: !attack name | use an attack with specified name.',
		help_on_empty: true,
		on_allowed_channel_only: true
	};
	command(list_options, attack);
	var list_options = {
		command: 'use',
		name: 'use',
		help: 'Help: !use name | use an attack with specified name.',
		help_on_empty: true,
		on_allowed_channel_only: true
	};
	command(list_options, attack);
}

function attack(msg, text, guild_room, player_stats, modules) {
	function win(p1, p2) {
		msg.channel.sendMessage('<@' + p1.id + '> has won.');
		/*db.serialize(function {
		    db.run('UPDATE Guilds SET DMG_RANGE =\'' + list + '\' WHERE ID ="' + guild_room.get_settings().id + '"');
		});*/
	}

	var p_id = msg.member.id;
	var b_id = guild_room.players[p_id];
	var battle = guild_room.battles[b_id];
	if (b_id === undefined || battle.state != 2 || battle.turn != p_id)
		return;
	var index = text.indexOf(' ');
	if (index == -1)
		return true;
	var attack_name = msg.content.substring(index, text.length).trim();
	battle.attack(p_id, attack_name);

}
