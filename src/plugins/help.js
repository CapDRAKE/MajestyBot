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
        .setColor("#FF9700")
        .setTitle(`${guild}`)
        .setThumbnail(guild.iconURL)
        .addField("≫**Mon prefix est :**", "+")
        .addField("≫**Liste des commandes :**", " -`help => Avoir la liste des commandes`\n -`info => Informations du serveur`\n -`play => Jouer de la musique`\n -`stop => Déconnecter le bot`\n -`suggestion => Proposer une idée`\n -`serverinfo => Informations du serveur discord`")
        .setTimestamp()        
      message.channel.send(embed);
      // return message.channel.send(`${emoji.unneutralLvl} **Utility** commands are temporarily disabled...`)
    }
}