const Discord = require('discord.js')

module.exports.command = {
    name: "ping",
    alias: [],
    help: {
      info: "Ping? to pong"
    },

    run: function(message) {
       mmessage.delete()
      message.channel.send(`🏓 Ping....`).then(msg=>{
        const _ = new Discord.MessageEmbed()
          .setTitle('Pong!')
          .setThumbnail("https://cdn.dribbble.com/users/540729/screenshots/3845838/empty.gif")
          .setDescription(`🏓 Pong!\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
          .setColor('RANDOM')
        msg.edit(_);
        msg.edit("\u200B")
    })
    }
}