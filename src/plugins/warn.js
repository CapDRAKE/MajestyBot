const Discord = require("discord.js");
const bdd = require("./../bdd.json");
const fs = require("fs");

module.exports.command = {
  name: "warn",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Tu n'as pas les permissions requises.").then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 5000)
      });
    if (!args[0]) return message.channel.send("Vous devez mentionner quelqu'un.").then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 5000)
      });
    let utilisateur = message.mentions.users.first() || message.guild.member(args[0])
    if (!bdd["warn"][utilisateur.id]) {
        bdd["warn"][utilisateur.id] = 1;
        Savebdd();
        return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissement.`).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000)
          });
    }
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
    function Savebdd() {
      fs.writeFile("./../bdd.json", JSON.stringify(bdd, null, 4), (err) => {
          //if (err) message.channel.send("Une erreur est survenue.");
      });
    }
  }
};

