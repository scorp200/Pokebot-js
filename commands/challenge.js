module.exports = {
	init: init
};

function init(command) {
	var list_options = {
		command: 'challenge',
		name: 'challenge',
		help: 'Help: challenge @user | challenge the mentioned user.',
		help_on_empty: true,
		on_allowed_channel_only: true
	};
	command(list_options, challenge);
}

function challenge(msg, text, guild_room, player_stats, modules, commands, db) {
	if (!msg.mentions.users.first()) {
		msg.reply('```Invalid player```');
		return;
	}
	var p1 = msg.member;
	var p2 = msg.mentions.members.first();
	if (p1.id == p2.id) {
		msg.channel.send("You can't challenge your self", { code: 'ml' });
		//return;
	}
	var p_id = [{ id: p1.id, name: p1.displayName }, { id: p2.id, name: p2.displayName }];
	for (var i in p_id) {
		if (guild_room.players[p_id[i].id] != undefined) {
			msg.reply('```One of you is already in a battle!```');
			return;
		}
	}
	var settings = guild_room.settings;
	var index = Utils.indexOf(guild_room.battles, undefined);
	var b_id = index > -1 ? index : guild_room.battles.length;
	var p_list = {};
	for (var i in p_id) {
		var hp = Utils.get_random_range(settings.hp_range.min, settings.hp_range.max);
		p_list[p_id[i].id] = { id: p_id[i].id, name: p_id[i].name, poke_name: undefined, hp: hp, max_hp: hp, type: Utils.get_random_type() };
		guild_room.players[p_id[i].id] = b_id;
	}
	guild_room.battles[b_id] = Battle.create(b_id, msg.channel, p_id[0], p_list, { min: settings.damage_range.min, max: settings.damage_range.max }, settings.crit_rate);
	console.log("Room:" + settings.id + " Challenge: " + p_id[0].id + " vs " + p_id[1].id + " id: " + b_id);
	msg.channel.send(p_list[p_id[0].id].name + ' challenged ' + p_list[p_id[1].id].name, { code: 'ml' });
}
