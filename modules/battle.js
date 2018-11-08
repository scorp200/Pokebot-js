var Battle = (function() {
	function create(id, guild_room, channel, turn, players, damage_range, crit_rate) {
		var state = 1;

		function attack(p1_id, name) {
			var p2_id;
			for (var key in players) {
				if (key != p1_id) {
					p2_id = key;
					break;
				}
			}
			var p1 = players[p1_id];
			var p2 = players[p2_id];
			var type = Utils.get_random_type();
			var damage_mult = Utils.get_damage_mult(type, p2.type) * Math.random() < crit_rate ? 2 : 1;
			if (damage_mult == 0) {
				channel.send(p1.poke_name + ' tried to use ' + name + ' but failed.', { code: 'ml' });
				return
			}
			var damage = Math.floor(Utils.get_random_range(damage_range.min, damage_range.max) * damage_mult);
			p2.hp -= damage;
			var message = '';
			if (damage_mult == 2)
				message = 'A critical Hit!\n';
			message += p1.poke_name + ' used ' + name + ' type ' + type + '\n\n' + p2.poke_name + ' took ' + damage + ' damage and has ' + p2.hp + ' hp remaining.';
			if (damage_mult == 0.5)
				message += "\nBut it wasn't very effective";
			else if (damage_mult == 4)
				message += "\nIt's super effective!";
			channel.send(message, { code: 'ml' });
			if (p2.hp <= 0) {
				win(p1, p2);
			}
			turn = p2_id;
		}

		function win(p1, p2) {
			channel.send(p2.poke_name + ' has fainted.\n' + p1.name + ' and ' + p1.poke_name + ' have won!');
			guild_room.battles[id] = void 0;
			for (var key in players) {
				guild_room.players[key] = void 0;
			}
			db.get('players').then(function(doc) {
				var p = doc.players;
				var exists
				if (p.find(function(val, i) {
						if (val.id == p1.id)
							val.wins++;
						else if (val.id == p2.id)
							val.loses++;
					}) === undefined) {

				}
			}).catch(function(e) {
				db.put({ _id: 'players', players: [] }).catch(function(e) { console.log(e); });
			});
		}

		function setName(p_id, name) {
			if (state != 1)
				return;
			players[p_id].poke_name = name;
			var done = true;
			for (var key in players) {
				if (!players[key].poke_name)
					done = false;
			}
			if (done)
				state = 2;
			console.log('Room:' + channel.guild.id + ' Player: ' + p_id + ` | ` + name + ' | ' + players[p_id].hp + ' | ' + players[p_id].type);
			channel.send(players[p_id].name + '\nchose ' + name + ' with ' + players[p_id].hp + ' hp and type ' + players[p_id].type, { code: 'ml' });
		}

		return {
			id: id,
			players: players,
			channel: channel,
			get state() { return state },
			set state(val) { state = val },
			get turn() { return turn },
			set turn(val) { turn = val },
			attack: attack,
			setName: setName
		}
	}

	return {
		create: create
	}
})();
module.exports = Battle;
