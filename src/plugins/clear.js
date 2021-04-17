const Discord = require("discord.js");

module.exports.command = {
  name: "clear",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if(message.member.hasPermission('MANAGE_MESSAGES')){
      let args = message.content.trim().split(/ +/g);
  
        if(args[1]){
            console.log(args[1])
            console.log("ok")
            if(!isNaN(args[1]) && args[1] >- 1 && args[1] < 100){
                console.log("ok 2 ")
                message.channel.bulkDelete(args[1])
                message.channel.send(`Vous avez supprime ${args[1]} message(s) !`)
            }
            else{
                message.channel.send(`Vous devez indiquer une valeur entre 1 et 99 !`)
            }
        }
        else{
            message.channel.send(`Vous devez entrer un nombre`)
        }
    }
  else{
    return message.channel.send("Vous ne pouvez pas utiliser cette commande car vous n'avez pas la permission `manage_messages`");
  }
  },
};
