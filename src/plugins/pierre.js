const Discord = require("discord.js");

module.exports.command = {
  name: "pierre",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    let choices = ['pierre', 'papier', 'ciseaux'];
    if (!args[0]) {
        return message.channel.send('Merci de mettre votre choix parmis ' + choices)
    }
    
    
    if (choices.includes((args[0]).toLowerCase())) {
        let number = Math.floor(Math.random() * 3);
        if (number == 1) {
            return message.channel.send('C\'était une égalité, nous avions tous les deux ' + (args[0]).toLowerCase())
        }
        if (number == 2) {
            if ((args[0]).toLowerCase() == "pierre") {
                return message.channel.send('J\'ai gagné j\'ai pris **feuille**.')
            }
            if ((args[0]).toLowerCase() == "papier") {
                return message.channel.send('J\'ai gagné j\'ai pris **ciseaux**.')
            }
            if ((args[0]).toLowerCase() == "ciseaux") {
                return message.channel.send('J\'ai gagné j\'ai pris  **pierre**.')
            }
        }
        if (number == 0) {
            if ((args[0]).toLowerCase() == "pierre") {
                return message.channel.send('Tu as gagné j\'ai pris ciseaux.')
            }
            if ((args[0]).toLowerCase() == "papier") {
                return message.channel.send('Tu as gagné j\'ai pris pierre.')
            }
            if ((args[0]).toLowerCase() == "ciseaux") {
                return message.channel.send('Tu as gagné j\'ai pris papier.')
            }
        }
    } else {
        return message.channel.send('Merci de choisir entre : pierre, papier, ou ciseaux.')
    }
  },
};