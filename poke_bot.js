const fs = require('fs');
const Discord = require('discord.js');
const EventEmitter = require('events');
const reload = require('require-reload')(require);
const sqlite3 = require('sqlite3').verbose();
var configs = {};
var modules = {};
var player_stats = {};
var commands;
var precommands = {};
var guilds = {};
var help_list = {};
var db = new sqlite3.Database('db.sqlite');

function help_on_empty(func) {
    return function(msg, text, guild_room) {
        if (text.indexOf(' ') == -1) {
            return true;
        } else
            return func.apply(this, arguments);
    }
}

function on_allowed_channel_only(func) {
    return function(msg) {
        if (!guilds[msg.guild.id].channel_allowed(msg.channel.id))
            return;
        else
            return func.apply(this, arguments);
    }
}

function reload_commands() {
    commands = new EventEmitter();
    precommands = {};
    commands.on('pkreload', function(msg) {
        if (msg.member.user.id == '215928046023213059') {
            reload_commands();
            console.log('All commands have been reloaded.');
            msg.reply('All commands have been reloaded.');
        } else {
            msg.reply('Only the developer can reload commands.');
        }
    });
    commands.on('pre', function() {
        var keys = Object.keys(precommands)
        for (var x = 0; x < keys.length; x++) {
            precommands[keys[x]].apply(this, arguments);
        }
    });
    fs.readdirSync('./commands').forEach(function(file) {
        if (!file.endsWith('.js')) return;

        var name = file.substring(0, file.length - 3);
        modules[name] = reload('./commands/' + file);

        function command(options, func) {
            if (commands.listenerCount(options.command.toLowerCase()) > 0)
                throw new Error('Command with such name already exist.');
            if (options.help_on_empty)
                func = help_on_empty(func);
            if (options.on_allowed_channel_only)
                func = on_allowed_channel_only(func);

            help_list[options.command] = options.help;

            var f = function(msg) {
                if (func.apply(this, arguments) && options.help) {
                    msg.reply('```' + options.help + '```');
                }
            }
            if (options.pre_command)
                precommands[options.command.toLowerCase()] = f;
            else
                commands.on(options.command.toLowerCase(), f);
        }
        modules[name].init(command);
    });
    fs.readdirSync('./modules').forEach(function(file) {
        if (!file.endsWith('.js')) return;

        var name = file.substring(0, file.length - 3);
        modules[name] = reload('./modules/' + file);
    });
}

let score = JSON.parse(fs.readFileSync('./PokeSave.json', 'utf8'));
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var token = (process.argv[0]) ? config.devtoken : config.token;
var bot = new Discord.Client({
    autoReconnect: true
});

bot.on('ready', () => {
    reload_commands();
    console.log("poke_bot is ready");
});

bot.on("message", msg => {
    var text = msg.content.toLowerCase().trim();
    if (!guilds[msg.guild.id]) {
        var guild = reload('./modules/guild_room.js')
        var dmg = {
            MIN: 5,
            MAX: 25
        };
        var ch = {};
        try {
            db.run('INSERT OR IGNORE INTO Guilds (ID, HP_RANGE, DMG_RANGE, CRIT, RESTRICTED, CHANNEL_LIST, MOD_LIST) VALUES ("' + msg.guild.id + '",' + '\'{"MIN":"100","MAX":"200"}\'' + ',' + '\'{"MIN":"5","MAX":"25"}\'' + ',' + 0.3 + ',' + 0 + ',\'{}\',\'{}\')');
        } catch (errormsg) {
            console.log(errormsg);
        }
        guilds[msg.guild.id] = new guild(msg, db);
    }
    if (msg.author.bot)
        return;
    try {
        commands.emit('pre', msg, text, guilds[msg.guild.id], player_stats, modules, commands, db);
    } catch (errormsg) {
        console.log(errormsg);
    }
    if (text[0] == '!') {
        var index = text.length;
        if (text.indexOf(' ') > 0)
            index = text.indexOf(' ');
        var command = text.substring(1, index);
        try {
            commands.emit(command, msg, text, guilds[msg.guild.id], player_stats, modules, commands, db);
        } catch (errormsg) {
            console.log(errormsg);
        }
    }

});

bot.login(token);
