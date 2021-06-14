const Discord = require("discord.js");
const bdd = require("./../bdd.json");
const fs = require("fs");

module.exports.command = {
  name: "tempban",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if (!message.member.hasPermission('BAN_MEMBERS')) return;
        let utilisateur = message.mentions.members.first() || message.guild.member(args[0])
        temps = args[1];
        raison = args.splice(0, 1).join(" ");
        if (!utilisateur) return message.channel.send('Vous devez mentionner un utilisateur !').then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
        if (!temps || isNaN(temps)) return message.channel.send('Vous devez indiquer un temps en secondes !').then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
        if (!raison || args[2]) return message.channel.send('Vous devez indiquer une raison du ban !').then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
        message.guild.members.ban(utilisateur.id);
        message.channel.send("L'utilisateur a bien été banni").then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
        setTimeout(function () {
            message.guild.members.unban(utilisateur.id);
        }, temps * 1000);
  }
};
function Savebdd() {
    fs.writeFile("./../bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
  }
