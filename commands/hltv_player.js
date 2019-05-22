const Discord = require('discord.js');
const { HLTV } = require('hltv');

exports.run = async(client, message, args) => {
    let getPlayerPromise = HLTV.getPlayer({id: args[0]});
    
    getPlayerPromise.then((player) => {
        console.log(player);

        let playerEmbed = new Discord.RichEmbed()
                        .setColor('#0099ff')
                        .setTitle(player.ign)
                        .setURL(`https://www.hltv.org/stats/players/${args[0]}/${player.ign}`)
                        .setDescription(player.name)
                        .setThumbnail(player.image)
                        .addField('Twitter', player.twitter)
                        .addField('Twitch', player.twitch)
                        .addBlankField()
                        .addField('Rating', player.statistics.rating)
                        .addField('Kills Per Round', player.statistics.killsPerRound)
                        .addField('Headshots', player.statistics.headshots)
                        .addField('Maps Played', player.statistics.mapsPlayed)
                        .addField('Deaths Per Round', player.statistics.deathsPerRound)
                        .addField('Round Contributed', player.statistics.roundsContributed);

        message.channel.send(playerEmbed);
    });

    getPlayerPromise.catch((err) => {
        console.log(err);
        message.channel.send('Error fetching player data.');
    });
}