const Discord = require('discord.js');

exports.run = async(client, message, args) => {
    const aboutEmbed = new Discord.RichEmbed()
                                    .setTitle('chiken')
                                    .addBlankField()
                                    .addField('!player <player name>', 'Show HLTV player profile.')
                                    .addField('!team <team name>', 'Show HLTV team profile.')
                                    .addField('!team_ranking', 'Most recent HLTV global rankings.');

    message.channel.send(aboutEmbed);
}