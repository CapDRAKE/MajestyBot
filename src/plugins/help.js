const {MessageEmbed} = require('discord.js')
// go to index ok 
module.exports.command = {
  name: "help",
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
        .addField("≫**Mon prefix est :**", "+")
        .addField("≫**Liste des commandes :**", " -`help`\n -`info`\n -`ping`\n -`suggestion`\n -`serverinfo`")
        .setTimestamp()        
      message.channel.send(embed);
      // return message.channel.send(`${emoji.unneutralLvl} **Utility** commands are temporarily disabled...`)
    }
}