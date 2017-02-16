module.exports = function(msg, old_options) {
    var battles = {};
    var settings = {};

    if (old_options)
        settings = old_options;
    else
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
            id: msg.guild.id
        };
    console.log("guild:" + settings.id + " has been created.")

    this.channel_allowed = function(id) {
        if (Object.keys(settings.channel_list).length == 0)
            return true;
        else
            return settings.channel_list[id];
    }
    this.get_settings = function() {
        return settings;
    }
    this.get_battles = function() {
        return battles;
    }
}
