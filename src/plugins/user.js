const Discord = require("discord.js");
const bdd = require("./../bdd.json");
const fs = require("fs");

module.exports.command = {
  name: "user",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if(message.mentions.users.first()) {
        user = message.mentions.users.first();
   } else{
        user = message.author;
    }
    const member = message.guild.member(user);
    const moment = require("moment");

    const embed = new Discord.MessageEmbed() 
    .setColor('#ff5555')
    .setThumbnail(user.avatarURL)
    .setTitle(`Information sur ${user.username}#${user.discriminator} :`)
    .addField('ID du compte:', `${user.id}`, true)
    .addField('Pseudo sur le serveur :', `${member.nickname ? member.nickname : 'Aucun'}`, true)
    .addField('A crée son compte le :', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField('A rejoint le serveur le :', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
    .addField('Status:', `${user.presence.status}`, true)
    .addField('Joue a :', `${user.presence.game ? user.presence.game.name : 'Rien'}`, true)
    .addField('Roles :', member.roles.cache.map(roles => `${roles.name}`).join(', '), true)
    .addField(`En réponse a :`,`${message.author.username}#${message.author.discriminator}`)
    message.channel.send(embed).then(message => message.delete({ timeout: 15000 }));
  }
};
function Savebdd() {
    fs.writeFile("./../bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
  }
