const fs = require('fs');
const Discord = require('discord.js');
const EventEmitter = require('events');
const reload = require('require-reload')(require);

var configs = {};
var modules = {}
var player_stats = {};
var emitter;
var guilds = {};

function reload_modules() {
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
    reload_modules();
});

bot.on("message", msg => {
    if(!guilds[msg.guild.id]){
      guilds[msg.guild.id] = modules['guild_room'];
      guilds[msg.guild.id].init(msg);
    }
});

bot.login(token);
