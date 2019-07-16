const Discord = require('discord.js');
const request = require('request');
const { HLTV } = require('hltv');
const NodeCache = require('node-cache');

const playerCache = new NodeCache({ stdTTL: 43200, checkperiod: 10800 });

exports.run = async(client, message, args) => {
    let cachedPlayer = playerCache.get(args[0]);

    if (cachedPlayer != undefined) {
        console.log("RETURNING CACHED PLAYER PROFILE");
        sendPlayer(message, cachedPlayer);
    }
    else {
        request(`${HLTV.config.hltvUrl}/search?term=${args[0]}`, (err, res, body) => {
            if (err) {
                message.channel.send('Problem searching for player.');
                console.log(err);
                return;
            }
    
            var searchObj = JSON.parse(body);
            if (searchObj[0].players[0] === undefined) {
                message.channel.send("Player doesn't exist.");
                return;
            }
    
            let playerId = searchObj[0].players[0].id;
    
            let getPlayerPromise = HLTV.getPlayer({id: playerId});
    
            getPlayerPromise.then((player) => {
                // don't care about cache success or fail for now
                playerCache.set(args[0], player);
                sendPlayer(message, player);
            });
    
            getPlayerPromise.catch((err) => {
                console.log(err);
                message.channel.send('Error fetching player data.');
            });
        });
    }
}

var sendPlayer = (message, player) => {
    let playerEmbed = new Discord.RichEmbed()
                                  .setColor('#0099ff')
                                  .setTitle(player.ign)
                                  .setURL(`https://www.hltv.org/stats/players/${player.id}/${player.ign}`)
                                  .setDescription(player.name)
                                  .setThumbnail(player.image)
                                  .addField('Twitter', player.twitter)
                                  .addField('Twitch', player.twitch)
                                  .addBlankField()
                                  .addField('Stats For Past 3 Months', '\u200b')
                                  .addField('Rating', player.statistics.rating)
                                  .addField('Kills Per Round', player.statistics.killsPerRound)
                                  .addField('Headshots', player.statistics.headshots)
                                  .addField('Maps Played', player.statistics.mapsPlayed)
                                  .addField('Deaths Per Round', player.statistics.deathsPerRound)
                                  .addField('Round Contributed', player.statistics.roundsContributed);
    
    message.channel.send(playerEmbed);
}