module.exports = function(id, db) {
    var battles = {};
    var settings = undefined;
    db.each('SELECT * FROM Guilds WHERE ID="' + id + '"', function(err, row) {
        settings = {
            hp_range: JSON.parse(row.HP_RANGE),
            damage_range: JSON.parse(row.DMG_RANGE),
            crit_rate: row.CRIT,
            channel_list: JSON.parse(row.CHANNEL_LIST),
            restrict: row.RESTRICTED == 1 ? true : false,
            id: id,
            bid: 0,
            mod_list: JSON.parse(row.MOD_LIST)
        };
        console.log('Guild:' + id + ' has loaded settings succesfully');
    }, OnLoad);

    function OnLoad() {
        if (!settings) {
            settings = {
                hp_range: {
                    MIN: 200,
                    MAX: 100
                },
                damage_range: {
                    MIN: 5,
                    MAX: 25
                },
                crit_rate: 0.3,
                channel_list: {},
                restrict: false,
                id: id,
                bid: 0,
                mod_list: {}
            };
            console.log('Guild:' + id + ' settings has been set to default.');
        }
    }
    this.channel_allowed = function(id) {
        if (!settings.channel_list)
            return false;
        if (Object.keys(settings.channel_list).length == 0)
            return true;
        else
            return settings.channel_list[id] != undefined;
    }
    this.isMod = function(id) {
        if (!settings.mod_list) //CHANGE TO CHECK FOR PERMISSION
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
