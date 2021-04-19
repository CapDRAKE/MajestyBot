const fs = require("fs");
const Discord = require("discord.js");
const ticketSystem = require('djs-ticketsystem');
//const bdd = require("./bdd.json");
var ffmpeg = require('ffmpeg');

const Bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
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
    client.player.stop(message);
  }
  if(command === "skip"){
    client.player.skip(message);
  }
  if(command === "pause"){
    client.player.pause(message);
  }

});
client.login(token);
// Then add some messages that will be sent when the events will be triggered
client.player

// Send a message when something is added to the queue
.on('trackAdd', (message, queue, track) => message.channel.send(`${track.title} a été ajouté à la file d'attente !`))
.on('playlistAdd', (message, queue, playlist) => message.channel.send(`${playlist.title} a été ajouté à la file d'attente (${playlist.tracks.length} songs)!`))

// Send messages to format search results
.on('searchResults', (message, query, tracks) => {

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Voici vos résultats de recherche pour ${query}!`)
    .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
    .setFooter('Envoyez le numéro de la chanson que vous souhaitez écouter !')
    message.channel.send(embed);

})
.on('searchInvalidResponse', (message, query, tracks, content, collector) => {

    if (content === 'cancel') {
        collector.stop()
        return message.channel.send('Recherche annulée')
    }

    message.channel.send(`Tu dois envoyer un numéro entre 1 et ${tracks.length}!`)

})
.on('searchCancel', (message, query, tracks) => message.channel.send('Vous avez fourni une mauvaise réponse ... Veuillez renvoyer la commande!'))
.on('noResults', (message, query) => message.channel.send(`Aucun résultat trouvé sur YouTube pour ${query}!`))

// Send a message when the music is stopped
.on('queueEnd', (message, queue) => message.channel.send('La musique est arrêtée car il y a plus de musique dans la file!'))
.on('channelEmpty', (message, queue) => message.channel.send('La musique a été coupée car personne ne se trouvait dans le channel!'))
.on('botDisconnect', (message) => message.channel.send('La musique est arrêtée car ma personne a été déconnecté du channel!'))

// Error handling
.on('error', (error, message) => {
    switch(error){
        case 'NotPlaying':
            message.channel.send('Pas de musique en cours de lecture sur ce serveur!')
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

Bot.on("guildMemberAdd", member => {
  console.log("verif")
  member.send(`Bienvenue sur le serveur ${member.user.username} !\n Tu recherches un hébergeur Minecraft de qualité? Rejoins Minestrator => https://minestrator.com/?partner=eus561rkso`)
  Bot.channels.cache.get('710491445391523971').send(`Bienvenue sur le serveur ${member}!`)
  member.roles.add('712074657410580491');
});

 /*******************************************
    ************ SYSTEME DE TICKETS ************
    *******************************************/
//Bot.on("messageReactionAdd", (reaction, user) => {
  //nif (user.bot) return
   // if (reaction.emoji.name == "✅" && reaction.message.guild.channels.get("772175744238616598")) {
        //reaction.message.channel.send('Tu as réagi : ✅');
       // reaction.message.guild.channels.create(`ticket de ${user.username}`, {
            //type: 'text',
           // parent: "772175302298173451",
           // permissionOverwrites: [{
               //id: reaction.message.guild.id,
                //deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                //allow: ['ADD_REACTIONS']},
                //{
               //id: user.id,
              //  deny: [],
            //    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                //},
                //{
                  //id : reaction.message.guild.roles.get("690178116110647306"),
                  //deny: [],
                  //allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                
          // }],
        //}).then(channel_ticket => {
      //      channel_ticket.send("Channel crée !")
    //    })
  //  }
//})

Bot.on("message", message => {
  let args = message.content.substring(prefix.length).split(" ");
  if (message.content.startsWith(Config.prefix)) {
    runCommand(message);
  }
 
});


//function Savebdd() {
//  fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
//      if (err) message.channel.send("Une erreur est survenue.");
//  });
//}

Bot.login(token);
