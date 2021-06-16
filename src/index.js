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
const voiceCollection = new Discord.Collection();

client = new Discord.Client({
  fetchAllMembers: false
}),
DisTube = require("distube"),
distube = new DisTube(client, {
  searchSongs: false,
  emitNewSongOnly: false,
  highWaterMark: 1024*1024*64,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  youtubeDL: true,
  updateYouTubeDL: true
});
const disbut = require('discord-buttons');
disbut(client);
const { getTracks, getPreview } = require("spotify-url-info");

client.login(token);

var list = [];
client.on("message", async message => {
    let msg = message.content.slice(7)
    let args = message.content.trim().split(/ +/g);

    if (message.content.startsWith(prefix + "play")) {
        message.delete();
        const VoiceChannel = message.member.voice.channel;
        if(!VoiceChannel) return message.channel.send("Il n'y a personne dans la vocal !"); //Vérifier si quelqu'un est dans la vocal
        if(!msg) return message.channel.send('Précise une musique !'); // Vérifier si y a un nom de musique.

        //Bouton
        let play = new disbut.MessageButton().setStyle('gray').setID('pause').setLabel('⏸'); // Bouton play
        let rplay = new disbut.MessageButton().setStyle('gray').setID('replay').setLabel('▶'); // Bouton resume
        let stop = new disbut.MessageButton().setStyle('gray').setID('leave').setLabel('⏹'); // Bouton leave
        let suivant = new disbut.MessageButton().setStyle('gray').setID('skip').setLabel('⏭'); //Bouton skip
        let repeat = new disbut.MessageButton().setStyle('gray').setID('loop').setLabel('🔁'); //Bouton loop
        let repeat1 = new disbut.MessageButton().setStyle('gray').setID('loop1').setLabel('🔂'); //Bouton off-loop
        let aleatoire = new disbut.MessageButton().setStyle('gray').setID('shuffle').setLabel('🔀'); //Bouton random
        let queu = new disbut.MessageButton().setStyle('gray').setID('list').setLabel('💿'); // Bouton list music
        //Assemblage de bouton
        let lister = new disbut.MessageActionRow().addComponent(queu);
        let pause = new disbut.MessageActionRow().addComponent(play).addComponent(suivant).addComponent(repeat).addComponent(aleatoire).addComponent(stop);// Musique jouée
        let pauserepeat = new disbut.MessageActionRow().addComponent(play).addComponent(suivant).addComponent(repeat1).addComponent(aleatoire).addComponent(stop);//Musique répété
        let reprendre = new disbut.MessageActionRow().addComponent(rplay).addComponent(suivant).addComponent(repeat).addComponent(aleatoire).addComponent(stop);//Musique pause

        if (list.length < 1) {
            list.push(args[2]);
            let embed = new Discord.MessageEmbed() //Création embed
                .setColor("ORANGE")
                .setTitle('**MajestyMusic**')
                .setDescription(`Je joue de la musique !`)
                .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
            const send_play = await message.channel.send({embed: embed, components: [pause, lister]}); // Envoie de l'embed et du bouton
            const filter = (button) => button.clicker.user.id == message.author.id; // Les boutons marche que pour l'auteur du message
            const collector = send_play.createButtonCollector(filter); // Création du collector de bouton
            collector.on('collect', b =>{
                b.defer();

                // Fonction des actions
                function paus(){ //Fonction pause
                    if(distube.isPaused(message)) return message.channel.send("ERREUR: La musique est déjà en pause.").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    let embedpause = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle('**MajestyMusic**')
                    .setDescription(`La musique est en pause !`)
                    .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedpause, components: [reprendre, lister]});
                    distube.pause(message);
                }
                function reprendr(){ //Fonction resume
                    if (!distube.isPaused) return message.channel.send("ERREUR: La musique n'est pas en pause.").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    let embedreprendre = new Discord.MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle('**MajestyMusic**')
                        .setDescription(`Je reprend la musique en pause !`)
                        .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedreprendre, components: [pause, lister]});
                    distube.resume(message);
                }
                function leave(){ //Fonction leave
                    const meVoiceChannel = message.guild.me.voice.channel;
                    if(!meVoiceChannel) return message.channel.send("Je ne suis pas dans la vocal !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    });
                    let embedleave = new Discord.MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle('**MajestyMusic**')
                        .setDescription(`J'arrête de jouer de la musique !`)
                        .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedleave});
                    distube.stop(message);
                    list = [];
                }
                function skipped(){ //Fonction skip
                    let queue = distube.getQueue(message);
                    if (!queue.songs[1]) return message.channel.send("ERREUR: Aucune prochaine musique.").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    });
                    let embedskip = new Discord.MessageEmbed()
                        .setColor("ORANGE")
                        .setTitle('**MajestyMusic**')
                        .setDescription(`Je passe à la prochaine musique chef !`)
                        .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                        send_play.edit({embed: embedskip, components: [pause, lister]});
                    distube.skip(message);
                }
                function loop(){ //Fonction loop
                    let queue = distube.getQueue(message);
                    if (!queue.songs[1]) return message.channel.send("ERREUR: La liste est vide !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    if(distube.isPaused(message)) return message.channel.send("ERREUR: La musique est en pause !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    let embedloop = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle('**MajestyMusic**')
                    .setDescription(`Je répète la musique 1 fois !`)
                    .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedloop, components: [pauserepeat, lister]});
                    distube.setRepeatMode(message, parseInt(1));
                }
                function loop1(){ //Fonction off-loop
                    let queue = distube.getQueue(message);
                    if (!queue.songs[1]) return message.channel.send("ERREUR: La liste est vide !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    if(distube.isPaused(message)) return message.channel.send("ERREUR: La musique est en pause !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    let embedloop1 = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle('**MajestyMusic**')
                    .setDescription(`Répétition remise à 0 !`)
                    .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedloop1, components: [pause, lister]});
                    distube.setRepeatMode(message, parseInt(0));
                }
                function shuffle(){ //Fonction aléatoire
                    let queue = distube.getQueue(message);
                    if (!queue.songs[5]) return message.channel.send("ERREUR: La liste est pas assez rempli pour le mode aléatoire !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    });
                    if(distube.isPaused(message)) return message.channel.send("ERREUR: La musique est en pause !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    });
                    if(distube.setRepeatMode(message, parseInt(1))) return message.channel.send('Erreur : Mode loop activé !').then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    });
                    let embedshuffle = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle('**MajestyMusic**')
                    .setDescription(`Mode aléatoire activé !`)
                    .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                    send_play.edit({embed: embedshuffle, components: [pause, lister]});
                    distube.shuffle(message);
                }
                function liste(){ //Fonction list music
                    let queue = distube.getQueue(message);
                    if (!queue.songs[1]) return message.channel.send("ERREUR: La liste est vide !").then((file) =>{
                        setTimeout(()=> {
                            file.delete();
                        }, 5000);
                    })
                    let counter = 0; // Initialisation d'un variable counter à 0
                    for(let i = 0; i < queue.songs.length; i+=20){
                      if(counter >= 10) break;
                      let k = queue.songs;
                      let songs = k.slice(i, i + 20);
                      message.author.send(new Discord.MessageEmbed() // Envoyé le message en mp
                      .setColor("ORANGE")
                      .setTitle('**MajestyMusic**')
                      .setFooter('Profite de ta musique !', "https://cdn.discordapp.com/attachments/828238990443544626/828679113300508722/22-1.gif")
                      .setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}** [${song.name}](${song.url}) - ${song.formattedDuration}`)))
                      counter++;
                    }
                }
                //Condition lors du click sur les boutons avec comme action les fonctions qui conviennent
                if(b.id == "pause") return paus();
                if(b.id == "replay") return reprendr();
                if(b.id == "leave") return leave();
                if(b.id == "skip") return skipped();
                if(b.id == "loop") return loop();
                if(b.id == "loop1") return loop1();
                if(b.id == "shuffle") return shuffle();
                if(b.id == "list") return liste();
                //Intervale de 3 min pour supprimer faire leave le bot !
                setInterval(() => {
                    if(!queu.songs) return leave();
                }, 180000)
            });
        } else {
            //Ajout de musique à la file d'attente.
            (list.length > 0) 
            list.push(args[2]);
            message.channel.send('Musique ajouté à la file d\'attente.').then((file) =>{
                setTimeout(()=> {
                    file.delete();
                }, 5000);
            })
        };
        // POur les musiques Spotify
        if(args.slice(1).join(" ").toLowerCase().includes("spotify") && args.slice(1).join(" ").toLowerCase().includes("track")){
            getPreview(args.slice(1).join(" ")).then(result => {
                distube.play(message, result.title);
            })
        }
        // pour les playlist Spotify
        else if(args.slice(1).join(" ").toLowerCase().includes("spotify") && args.slice(1).join(" ").toLowerCase().includes("playlist")){
            getTracks(args.slice(1).join(" ")).then(result => {
                for(const song of result)
                distube.play(message, song.name);
            })
        //Lance la musique !
        }else {
            let songName = args.slice(1).join(" ");
            distube.play(message, songName);
        }
    };
});







const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;


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
  Bot.channels.cache.get('845229994309058571').send(`Bienvenue sur le serveur ${member}!`)
  Bot.channels.cache.get('845233355629002772').send(`${member}`).then(msg => {
    setTimeout(() => {
        msg.delete()
    }, 5)
  });
  member.roles.add('845209018829504522');
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
//client.on("ready", async () => {
//  console.log(`${client.user.username} en ligne`);
//    client.user.setActivity(`Une question ? MP moi !`, {type: "PLAYING"});
//});

client.on('message', async message => {
if (message.author.bot) return;
 if (message.channel.type === 'dm') {
        let ticketOpenned = false;
    
        client.guilds.cache.get('846319572881113088').channel.cache.filter(c=>c.name.startsWith('ticket-')).forEach(c=>{
            if(c.topic === message.author.id) ticketOpenned = true;
        })
        if (ticketOpenned) {
            const channelTicket = await client.guilds.cache.get('846319572881113088').channel.cache.find(c=>c.topic===message.author.id)
            channelTicket.send(`${message.author.tag}:\n${message.content?message.content:message.attachments.last().url}`)
        }
        else {
            const channelTicket = await client.guilds.cache.get('846319572881113088').channel.create(`ticket-${message.author.username}`, {type: 'text', parent: "846319572881113088", reason: 'DM TICKET', topic: "Ticket Support"})
                                                                                                                                           return channelTicket.send(`${message.author.tag}:\n${message.content}`)
        }
    }
    if (message.channel.name.startsWith("ticket-")) {
        console.log(message.channel.topic);
        let user = await client.users.fetch(message.channel.topic);
        user.send(`${message.author.tag}:\n${message.content?message.content:message.attachements.last().url}`)
    }
})

///Rejoindre pour créer
Bot.on("voiceStateUpdate", async (oldState, newState) => {
  const user = await Bot.users.fetch(newState.id);
  const member = newState.guild.member(user);

  if(!oldState.channel && newState.channel.id === '854296709143855134'){
      const channel = await newState.guild.channels.create(`🔊 • 𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝒅𝒆 ${user.username}`, {
          type: 'voice',
          parent: newState.channel.parent,
          permissionOverwrites: [{
              id: user.id,
              allow: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'VIEW_CHANNEL']
          }
          ]
      });

      member.voice.setChannel(channel);
      voiceCollection.set(user.id, channel.id);

  } else if(!newState.channel) {
      if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
  }
})

//Invites top
client.on('message', message => {
    if(message.content.startsWith(`${prefix}invites`)) {
        const { guild } = message

        guild.fetchInvites().then((invites) => {
            const inviteCounter = {}
            invites.forEach((invites) => {
                const { uses, inviter } = invites
                const { username, discriminator, id } = inviter

                const name = `<@${id}>`

                inviteCounter[name] = (inviteCounter[name] || 0) + uses
            })

            let replyText = 'Joueurs : '

            const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a])

            for (const invite of sortedInvites) {
                const count = inviteCounter[invite]
                replyText += `\n${invite} a invité ${count} personne(s)`
            }
            let embed = new Discord.MessageEmbed()
                .setTitle('Classement des invitations :')
                .setDescription(replyText)
                .setColor('ORANGE')
                .setTimestamp()
            message.channel.send(embed)
        })
    }
})


////Anti-lien
client.on("message" , async message => {
    if(message.content.includes("discord.gg/") || message.content.includes("discordapp/invite") || message.content.includes("discordapp.io")) {
  
    message.delete()
    message.reply(`Desolé, il est interdit de poster des lien dans ce serveur`).then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 5000)})
    }
})

////Anti-Spam 
const usersSpamMap = new Map();
//const bdd = require("./bdd.json");
function Savebdd() {
  fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if (err) message.channel.send("Une erreur est survenue.");
  });
}
client.on('message', async message => {
  if (message.author.bot) return;
  if (usersSpamMap.has(message.author.id)) {
    const userData = usersSpamMap.get(message.author.id);
    let {msgCount} = userData;
    let utilisateur = message.author.id;
    msgCount += 1
    userData.msgCount = msgCount;
    usersSpamMap.set(message.author.id, userData)
    if (msgCount >= 4) message.delete();
    if (msgCount === 5) {
      message.guild.member(message.author.id).roles.add('848569216835518464')
      if (bdd["warn"][utilisateur.id] == 2) {
        delete bdd["warn"][utilisateur.id]
        Savebdd();
        return message.guild.members.ban(utilisateur);

      } else {
        bdd["warn"][utilisateur.id]++
        Savebdd();
        return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissements.`).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
    }
    }
  }
  else {
    usersSpamMap.set(message.author.id, {
      msgCount: 1
    })
    setTimeout(() => {
      usersSpamMap.delete(message.author.id);
    }, 10000);
  }
});



Bot.on("message", message => {
  // anti-insulte
  let blacklisted = ["fdp","tg", "gueule", "ftg", "merde", "connard", "connard", "enculé", "ptn", "putain"] // dans les crochets tu mets les mots que tu ne veux pas voir, séparé par des virugules.
  let foundText = false;

  for(var i in blacklisted) {
    if(message.content.toLocaleLowerCase().includes(blacklisted[i].toLowerCase())) foundText = true;
  }
  if(foundText) {
    message.delete()
    message.channel.send(`Attention, ce type de langage n'est pas toléré ici.`).then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 5000)
      });
  };
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
