module.exports = {
    init: init
};

function init(command) {
    var list_options = {
        command: 'pksetdmgrange',
        name: 'setdmgrange',
        help_on_empty: true,
        help: 'Help: !pksetdmgrange min~max | set the damage range.',
        on_allowed_channel_only: true
    };
    command(list_options, set_damage);
    var list_options = {
        command: 'pksethprange',
        name: 'sethprange',
        help: 'Help: !pksethprange min~max | set the starting hp range.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, set_hp);
    var list_options = {
        command: 'pksetcritrate',
        name: 'setcritrate',
        help: 'Help: !pksetcritrate x | set the critical rate between 0 and 1.',
        help_on_empty: true,
        on_allowed_channel_only: true
    };
    command(list_options, set_crit);
}

function set_damage(msg, text, guild_room, player_stats, modules, commands, db) {
    var damage = text.match(/-?[\d]+(\.[\d]+)?~-?[\d]+(\.[\d]+)?/);
    if (damage[0]) {
        var num = damage[0].split('~');
        var min = parseFloat(num[0]);
        var max = parseFloat(num[1]);
        console.log('Guild:' + guild_room.get_settings().id + ' has set damage range to min:' + min + ', max:' + max);
        guild_room.get_settings().damage_range = {
            MIN: min,
            MAX: max
        };
        var list = JSON.stringify(guild_room.get_settings().damage_range);
        db.run('UPDATE Guilds SET DMG_RANGE =\'' + list + '\' WHERE ID ="' + guild_room.get_settings().id + '"');
        msg.channel.sendCode('cpp', 'Damage range has been set to min: ' + min + ', max: ' + max);
    }
}

function set_hp(msg, text, guild_room, player_stats, modules, commands, db) {
    var hp = text.match(/-?[\d]+(\.[\d]+)?~-?[\d]+(\.[\d]+)?/);
    if (hp[0]) {
        var num = hp[0].split('~');
        var min = parseFloat(num[0]);
        var max = parseFloat(num[1]);
        console.log('Guild:' + guild_room.get_settings().id + ' has set hp range to min:' + min + ', max:' + max);
        guild_room.get_settings().hp_range = {
            MIN: min,
            MAX: max
        };
        msg.channel.sendCode('cpp', 'HP range has been set to min: ' + min + ', max: ' + max);
        var list = JSON.stringify(guild_room.get_settings().hp_range);
        db.run('UPDATE Guilds SET HP_RANGE =\'' + list + '\' WHERE ID ="' + guild_room.get_settings().id + '"');
    }
}

function set_crit(msg, text, guild_room, player_stats, modules, commands, db) {
    var crit = text.match(/-?[\d]+(\.[\d]+)?/);
    if (crit[0]) {
        var num = parseFloat(crit[0]);
        if (num > 1)
            num = 1;
        else if (num < 0)
            num = 0;
        console.log('Guild:' + guild_room.get_settings().id + ' has set crit rate to:' + num);
        guild_room.get_settings().crit_rate = num;
        msg.channel.sendCode('cpp', 'Critical rate has been set to: ' + num);
        db.run('UPDATE Guilds SET CRIT =' + num + ' WHERE ID ="' + guild_room.get_settings().id + '"');
    }
}
