const fs = require("fs");
const Discord = require("discord.js");
const ticketSystem = require('djs-ticketsystem');
const bdd = require("./bdd.json");
var ffmpeg = require('ffmpeg');
const {MessageEmbed} = require('discord.js')

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
  member.send(`Bienvenue sur le serveur ${member.user.username} !\n Tu recherches un hébergeur Minecraft de qualité? Rejoins Minestrator => https://minestrator.com/?partner=eus561rkso \n Tu pourras y acheter un serveur, ou bien même prendre un serveur **totalement gratuit !**`)
  Bot.channels.cache.get('710491445391523971').send(`Bienvenue sur le serveur ${member}!`)
  Bot.channels.cache.get('832552184914509854').send(`${member}`).then(msg => {
    setTimeout(() => {
        msg.delete()
    }, 5)
  });
  member.roles.add('712074657410580491');
});

 /*******************************************
    ************ SYSTEME DE TICKETS ************
    *******************************************/
Bot.on("messageReactionAdd", (reaction, user) => {
  if (user.bot) return
  let categoryId = "772175744238616598";
  if (reaction.message.channel.id == '772175744238616598'){
    if (reaction.emoji.name == "✅") {
      reaction.users.remove(user.id);
      //reaction.message.channel.send('Tu as réagi : ✅');
      reaction.message.guild.channels.create(`ticket de ${user.username}`, {
          type: 'text',
          parent: "772175302298173451",
          permissionOverwrites: [{
             id: reaction.message.guild.id,
              deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
              allow: ['ADD_REACTIONS']},
              {
             id: user.id,
              deny: ['ADD_REACTIONS'],
              allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
              },
              {
                id : '690178116110647306',
                deny: ['ADD_REACTIONS'],
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'MANAGE_CHANNELS']
              },
              {
                id : '706086670167965706',
                deny: ['ADD_REACTIONS'],
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']             
         }],
      }).then(channel_ticket => {
          channel_ticket.send(`Ticket ouvert ! @everyone ${user.username} a besoin d'aide !\n Seul un modérateur ou un admin peut supprimer ce ticket !`)
          
      })
  }
  }else{
    return;
  }
})


 /*************************************************************
    ************ SYSTEME DE TICKETS PAR MP*********************
    ***********************************************************/
client.on("ready", async () => {
  console.log(`${client.user.username} en ligne`);
    client.user.setActivity(`Une question ? MP moi !`, {type: "PLAYING"});
});

client.on('message', async message => {
if (message.author.bot) return;
 if (message.channel.type === 'dm') {
        let ticketOpenned = false;
    
        client.guilds.cache.get('846319572881113088').channels.cache.filter(c=>c.name.startsWith('ticket-')).forEach(c=>{
            if(c.topic === message.author.id) ticketOpenned = true;
        })
        if (ticketOpenned) {
            const channelTicket = await client.guilds.cache.get('846319572881113088').channels.cache.find(c=>c.topic===message.author.id)
            channelTicket.send(`${message.author.tag}:\n${message.content?message.content:message.attachments.last().url}`)
        }
        else {
            const channelTicket = await client.guilds.cache.get('846319572881113088').channels.create(`ticket-${message.author.username}`, {type: 'text', parent: "846319572881113088", reason: 'DM TICKET', topic: "Ticket Support"})
                                                                                                                                           return channelTicket.send(`${message.author.tag}:\n${message.content}`)
        }
    }
    if (message.channel.name.startsWith("ticket-")) {
        console.log(message.channel.topic);
        let user = await client.users.fetch(message.channel.topic);
        user.send(`${message.author.tag}:\n${message.content?message.content:message.attachements.last().url}`)
    }
})

Bot.on("voiceStateUpdate", async (oldState, newState) => {
  const user = await Bot.users.fetch(newState.id);
  const member = newState.guild.member(user);

  if(!oldState.channel && newState.channel.id === '853763395248848986'){
      const channel = await newState.guild.channels.create("Channel de " + user.tag, {
          type: 'voice',
          parent: newState.channel.parent,
          permissionOverwrites: [{
              id: '417991602171281418',
              deny: 'CONNECT'
          }, {
              id: user.id,
              allow: 'MANAGE_CHANNELS',
          }
          ]
      });

      member.voice.setChannel(channel);
      voiceCollection.set(user.id, channel.id);

  } else if(!newState.channel) {
      if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
  }
})



Bot.on("message", message => {
  //  // anti-insulte
  //let blacklisted = ["fdp","tg", "merde", "con", "connard", "connard", "enculé", "nique", "ptn", "putain"] // dans les crochets tu mets les mots que tu ne veux pas voir, séparé par des virugules.
  //let foundText = false;

  //for(var i in blacklisted) {
    //if(message.content.toLocaleLowerCase().includes(blacklisted[i].toLowerCase())) foundText = true;
  //}
  //if(foundText) {
    //message.delete()
    //message.channel.send(`Comment tu parles jean-louis !!`) // Tu mets la phrase que tu veux, c'est quand  il a supprimé un mot.
  //};
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(prefixMention)) {
            return message.channel.send(`Quoi?`);
        }      

  let args = message.content.substring(prefix.length).split(" ");
  if (message.content.startsWith(Config.prefix)) {
    runCommand(message);
  } 
});


function Savebdd() {
  fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if (err) message.channel.send("Une erreur est survenue.");
  });
}

Bot.login(token);
