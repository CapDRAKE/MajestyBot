const Discord = require("discord.js");

module.exports.command = {
  name: "clear",
  alias: [],
  help: {
    info: "Clear des messages.",
  },
  run: function (message, user, args) {
    message.delete()
    if(!message.member.hasPermission('MANAGE_MESSAGES')) {
      const user = message.author
      var error_permissions = new Discord.MessageEmbed()
        .setDescription(`❌ ${user} tu ne disposes pas des permissions nécessaires pour clear les messages.`)
        .setColor("#F43436")
      message.channel.send(error_permissions)
    }
  
    if(message.member.hasPermission('MANAGE_MESSAGES')) {
      let args = message.content.split(/ +/g);
      if(args[1]) {
        if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 100) {
          message.channel.bulkDelete(args[1]++, true).then(collection => {
          var delete_message_ok = new Discord.MessageEmbed()
            .setDescription(`✅ **${collection.size} messages** ont été supprimés !`)
            .setColor("#1fbe0f")
          message.channel.send(delete_message_ok).then(message => {
            setTimeout(() => {
              message.delete()
            },5000)
          })
        })
  
        } else {
        const user = message.author
        var error_num = new Discord.MessageEmbed()
          .setDescription(`❌ ${user} ton nombre de messages à supprimer doit être compris entre **1** et **99**.`)
          .setColor("#f66263")
        message.channel.send(error_num).then(message => {
          setTimeout(() => {
            message.delete()
          },10000)
        })
        };
  
      } else {
      const user = message.author
      var error_num = new Discord.MessageEmbed()
        .setDescription(`❌ ${user} tu dois indiquer un nombre de messages à supprimer entre **1** et **99**.`)
        .setColor("#f66263")
      message.channel.send(error_num).then(message => {
        setTimeout(() => {
          message.delete()
        },10000)
      })
      };
    }
  },
};
