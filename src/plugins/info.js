const {MessageEmbed} = require('discord.js')
// go to index ok 
module.exports.command = {
  name: "info",
    alias: [],
    help: {
      info: "Get info of the current guild"
    },

    run: function(message, user, args, guild, cmd) {
    	message.delete()
      

      const embed = new MessageEmbed()
        .setColor("#00FFFF")
        .setTitle(`${guild}`)
        .setThumbnail(guild.iconURL)
        .addField("≫<a:479577351919894549:819686395630059530> **Ip du serveur minecraft**", "play.majestycraft.com")
        .addField("≫<a:781534787264970812:819685071408594975> **Lien du siteweb**", "majestycraft.com")
        .setTimestamp()        
      message.channel.send(embed);
      // return message.channel.send(`${emoji.unneutralLvl} **Utility** commands are temporarily disabled...`)
    }
}