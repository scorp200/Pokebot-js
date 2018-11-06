const fs = require('fs');
const Discord = require('discord.js');
const EventEmitter = require('events');
const reload = require('require-reload')(require);
const PouchDB = require('pouchdb');
var configs = {};
var modules = {};
var player_stats = {};
var commands;
var precommands = {};
var guilds = {};
var help_list = {};
var guildsLoaded = false;
var db = new PouchDB('data');
var guild;
var prefix = 'p!';

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
		global[capitalizeFirstLetter(name)] = modules[name];
	});
}
let score;
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var token = (process.argv[0]) ? config.devtoken : config.token;
var bot = new Discord.Client({
	autoReconnect: true
});

bot.on('ready', () => {
	reload_commands();
	db.get('guilds').then(function(doc) {
		for (var key in doc.settings) {
			var settings = doc.settings[key];
			guilds[settings.id] = Guild.create(settings.id, settings);
		}
		guildsLoaded = true;
		console.log("poke_bot is ready");
	}).catch(function(e) {
		db.put({ _id: 'guilds', settings: {} }).catch(function(e) { console.log(e); });
		guildsLoaded = true;
		console.log('no guilds');
	});
});

bot.on("message", msg => {
	var text = msg.content.toLowerCase().trim();
	if (msg.author.bot)
		return;
	if (!guildsLoaded) {
		msg.reply('The bot is still loading.');
		return;
	}
	if (!guilds[msg.guild.id]) {
		db.get('guilds').then(function(doc) {
			guilds[msg.guild.id] = Guild.create(msg.guild.id);
			doc.settings[msg.guild.id] = guilds[msg.guild.id].settings;
			db.put(doc);
		}).catch(function(e) { console.log(e); });
		console.log("guild:" + msg.guild.id + " has been created");
	}
	try {
		commands.emit('pre', msg, text, guilds[msg.guild.id], player_stats, modules, commands, db);
	} catch (errormsg) {
		console.log(errormsg);
	}
	if (text.indexOf(prefix) > -1) {
		var index = text.length;
		if (text.indexOf(' ') > 0)
			index = text.indexOf(' ');
		var command = text.substring(prefix.length, index);
		try {
			commands.emit(command, msg, text, guilds[msg.guild.id], player_stats, modules, commands, db);
		} catch (errormsg) {
			console.log(errormsg);
		}
	}

});

bot.login(token);

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
