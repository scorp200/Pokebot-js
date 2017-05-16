module.exports = function(msg, db) {
    var battles = {};
    var settings = undefined;
    db.each('SELECT * FROM Guilds WHERE ID="' + msg.guild.id + '"', function(err, row) {
        settings = {
            hp_range: JSON.parse(row.HP_RANGE),
            damage_range: JSON.parse(row.DMG_RANGE),
            crit_rate: row.CRIT,
            channel_list: JSON.parse(row.CHANNEL_LIST),
            restrict: row.RESTRICTED == 1 ? true : false,
            id: msg.guild.id,
            bid: 0,
            mod_list: JSON.parse(row.MOD_LIST)
        };
        console.log('Guild:' + msg.guild.id + ' has loaded settings succesfully');
    });
    if (!settings){
        settings = {
            hp_range: {
                max: 200,
                min: 100
            },
            damage_range: {
                min: 5,
                max: 25
            },
            crit_rate: 0.3,
            channel_list: {},
            restrict: false,
            id: msg.guild.id,
            bid: 0,
            mod_list: {}
        };
      }
    console.log("guild:" + settings.id + " has been created");
    this.channel_allowed = function(id) {
        if (!settings.channel_list)
            return false;
        if (Object.keys(settings.channel_list).length == 0)
            return true;
        else
            return settings.channel_list[id] != undefined;
    }
    this.isMod = function(id) {
        if (!settings.mod_list)//CHANGE TO CHECK FOR PERMISSION
            return false;
        if (Object.keys(settings.channel_list).length == 0)
            return true;
        else
            return settings.channel_list[id] != undefined;
    }
    this.get_settings = function() {
        return settings;
    }
    this.get_battles = function() {
        return battles;
    }
    this.get_player_battle = function(pid) {
        for (var bid in battles) {
            var b = battles[bid];
            if (b.players[pid])
                return bid;
        }
        return false;
    }
}
