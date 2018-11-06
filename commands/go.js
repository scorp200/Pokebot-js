module.exports = {
	init: init
};

function init(command) {
	var list_options = {
		command: 'go',
		name: 'go',
		help: 'Help: go name | choose a pokemon with specified name.',
		help_on_empty: true,
		on_allowed_channel_only: true
	};
	command(list_options, go);
}

function go(msg, text, guild_room, player_stats, modules) {
	var p_id = msg.member.id;
	var b_id = guild_room.players[p_id];
	if (b_id === undefined)
		return;
	var battle = guild_room.battles[b_id]
	if (battle.state != 1 || battle.players[p_id].poke_name != undefined)
		return;
	var index = text.indexOf(' ');
	if (index == -1)
		return true;
	var poke_name = msg.content.substring(index, text.length).trim();
	battle.setName(p_id, poke_name);
}
