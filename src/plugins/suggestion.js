const Discord = require("discord.js");

module.exports.command = {
  name: "suggestion",
  alias: [],
  help: {
    info: "Creates a poll based on the text which follows the command.",
  },
  run: function (message, user, args) {
     message.delete()
    let suggestion = args.join(" ")
    const embed = new Discord.MessageEmbed()
      .setTitle(suggestion)
      .setThumbnail(
        "https://www.clipartkey.com/mpngs/m/100-1003892_thumbs-up-down-thumbs-up-and-down-png.png"
      )
      .setDescription(
        "Réagissez avec un emoji <pouce vers le haut> ou <pouce vers le bas> pour voter a la suggestion"
      )
      .setColor("RANDOM");
    message.guild.channels.cache.get('826159906607333446').send(embed).then((messageReaction) => {
      messageReaction.react("👍");
      messageReaction.react("👎");
    });
  },
};
