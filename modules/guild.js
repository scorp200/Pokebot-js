var Guild = (function() {
	function create(id, settings) {
		var battles = [];
		var players = {};
		if (!settings) {
			settings = {
				hp_range: { min: 200, max: 100 },
				damage_range: { min: 5, max: 25 },
				crit_rate: 0.3,
				channel_list: {},
				restrict: false,
				id: id,
				mod_list: {}
			};
			console.log('Guild:' + _id + ' settings has been set to default.');
		}

		function channel_allowed(id) {
			if (Object.keys(settings.channel_list).length == 0)
				return true;
			else
				return settings.channel_list[id] != undefined;
		}

		function isMod(id) {
			if (Object.keys(settings.mod_list).length == 0)
				return true;
			else
				return settings.mod_list[id] != undefined;
		}

		return {
			settings: settings,
			battles: battles,
			channel_allowed: channel_allowed,
			isMod: isMod,
			players: players,
			get id() { return id }
		}
	}
	return {
		create: create
	}
})();
module.exports = Guild;
