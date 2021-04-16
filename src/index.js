const fs = require("fs");
const Discord = require("discord.js");
var ffmpeg = require('ffmpeg');

const Bot = new Discord.Client();
const Config = require("./../config/config.js");
const prefix = Config.prefix;
const token = Config.token;

client = new Discord.Client();

const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
client.player.on('trackStart', (message, track) => message.channel.send(`Je joue ${track.title} dans ton channel...`))
client.on("ready", () => {
  console.log("I'm ready !");
});
client.on("message", async (message) => {

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // !play Despacito
  // will play "Despacito" in the member voice channel

  if(command === "play"){
      client.player.play(message, args[0]);
      // as we registered the event above, no need to send a success message here
  }
  if(command === "stop"){
    client.player.stop();
  }

});
client.login(token);
// Then add some messages that will be sent when the events will be triggered
client.player

// Send a message when something is added to the queue
.on('trackAdd', (message, queue, track) => message.channel.send(`${track.title} has been added to the queue!`))
.on('playlistAdd', (message, queue, playlist) => message.channel.send(`${playlist.title} has been added to the queue (${playlist.tracks.length} songs)!`))

// Send messages to format search results
.on('searchResults', (message, query, tracks) => {

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Here are your search results for ${query}!`)
    .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
    .setFooter('Send the number of the song you want to play!')
    message.channel.send(embed);

})
.on('searchInvalidResponse', (message, query, tracks, content, collector) => {

    if (content === 'cancel') {
        collector.stop()
        return message.channel.send('Recherche annulée')
    }

    message.channel.send(`Tu dois envoyer un numéro entre 1 et ${tracks.length}!`)

})
.on('searchCancel', (message, query, tracks) => message.channel.send('You did not provide a valid response... Please send the command again!'))
.on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))

// Send a message when the music is stopped
.on('queueEnd', (message, queue) => message.channel.send('Music stopped as there is no more music in the queue!'))
.on('channelEmpty', (message, queue) => message.channel.send('Music stopped as there is no more member in the voice channel!'))
.on('botDisconnect', (message) => message.channel.send('Music stopped as I have been disconnected from the channel!'))

// Error handling
.on('error', (error, message) => {
    switch(error){
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!')
            break;
        case 'NotConnected':
            message.channel.send('Tu crois vraiment que je vois pas que tu es pas dans un vocal?')
            break;
        case 'UnableToJoin':
            message.channel.send('Je peux pas parler!')
            break;
        case 'LiveVideo':
            message.channel.send('Je supporte pas les lives youtube mec!')
            break;
        case 'VideoUnavailable':
            message.channel.send('Cette vidéo est indisponible !');
            break;
        default:
            message.channel.send(`Quelque chose ne va pas.. Erreur: ${error}`)
    }
})

global.Bot = Bot;

Bot.commands = {};

function loadCommands() {
  fs.readdirSync("src/plugins")
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      const cmd = require(`./plugins/${file}`).command;
      let obj = {};
      obj[cmd.name] = cmd;
      Object.assign(Bot.commands, obj);
      console.log(`✅ Loaded command ${file}`);
    });
}

function runCommand(message) {
  const { user, args, guild, cmd } = generateCommandParams(message);

  if (Bot.commands.hasOwnProperty(cmd)) {
    return Bot.commands[cmd].run(message, user, args, guild, cmd);
  }
}

function generateCommandParams(message) {
  let user = message.author;
  let args = message.content
    .slice(Config.prefix.length)
    .trim()
    .split(" ");
  let guild = message.member.guild;
  let cmd = args.shift().toLowerCase();

  for (let i in args) args[i] = args[i].trim();

  return { user, args, guild, cmd };
}

Bot.on("ready", () => {
  try {
    loadCommands();
    // console.log(Bot.commands)
    console.log("Commands loaded successfully!");
  } catch (err) {
    throw err;
  }

  console.log(`Connected to Discord as  ${Bot.user.tag}!`);

  Bot.user.setActivity(Config.activity);
});

Bot.on("message", message => {
  let args = message.content.substring(prefix.length).split(" ");

  if (message.content.startsWith(Config.prefix)) {
    runCommand(message);
  }
 
});

Bot.login(token);
