module.exports = {
    init: init,
    options: settings
    battles: battles;
};
var settings = {};

function init(msg, old_options = undefined) {
    id = msg.guild.id;
    console.log(id);
    if (old_options)
        options = old_options;
    else
        options = {
            hp_range: {
                max: 200,
                min: 100
            },
            damage_range: {
                min: 5,
                max: 25
            }
            crit_rate: 0.3,
            channel_list: {},
            id: 0
        };
}
