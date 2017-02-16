const fs = require('fs');
const Discord = require('discord.js');
const EventEmitter = require('events');
const reload = require('require-reload')(require);

var configs = {};
var modules = {};
var player_stats = {};
var commands;
var guilds = {};
var help_list = {};

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
    fs.readdirSync('./commands').forEach(function(file) {
        if (!file.endsWith('.js')) return;

        var name = file.substring(0, file.length - 3);
        modules[name] = reload('./commands/' + file);

        function command(options, func) {
            if (commands.listenerCount(options.name.toLowerCase()) > 0)
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

            commands.on(options.command.toLowerCase(), f);
        }
        modules[name].init(command);
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
        guilds[msg.guild.id] = new guild(msg);
    }

    if (text[0] == '!') {
        var index = text.length;
        if (text.indexOf(' ') > 0)
            index = text.indexOf(' ');
        var command = text.substring(1, index);
        commands.emit(command, msg, text, guilds[msg.guild.id], player_stats)
    }
});

bot.login(token);
