const Discord = require("discord.js");
const bdd = require("./../bdd.json");
const fs = require("fs");

module.exports.command = {
  name: "unban",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if (!message.member.hasPermission('BAN_MEMBERS')) return;
        let utilisateur = message.mentions.members.first() || message.guild.member(args[0])
        if (!utilisateur) return message.channel.send('Vous devez mentionner un utilisateur !').then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
        message.guild.members.ban(utilisateur.id);
        message.channel.send("L'utilisateur a bien été unban").then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
  }
};
function Savebdd() {
    fs.writeFile("./../bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
  }
