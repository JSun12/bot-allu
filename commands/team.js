const Discord = require('discord.js');
const request = require('request');
const { HLTV } = require('hltv');
const NodeCache = require('node-cache');

const teamCache = new NodeCache({ stdTTL: 43200, checkperiod: 10800 });
const RECENT_MATCHES_TO_SHOW = 5;

exports.run = async(client, message, args) => {
    let cachedTeam = teamCache.get(args[0]);

    if (cachedTeam != undefined) {
        console.log("RETURNING CACHED TEAM PROFILE");
        sendTeam(message, cachedTeam);
    }
    else {
        request(`${HLTV.config.hltvUrl}/search?term=${args[0]}`, (err, res, body) => {
            if (err) {
                message.channel.send('Problem searching for team.');
                console.log(err);
                return;
            }
    
            var searchObj = JSON.parse(body);
            if (searchObj[0].teams[0] === undefined) {
                message.channel.send("Team doesn't exist.");
                return;
            }
    
            let teamId = searchObj[0].teams[0].id;
    
            let getTeamPromise = HLTV.getTeam({id: teamId});
    
            getTeamPromise.then((team) => {
                // don't care about cache success or fail for now
                teamCache.set(args[0], team);
                sendTeam(message, team);
            });
    
            getTeamPromise.catch((err) => {
                console.log(err);
                message.channel.send('Error fetching team data.');
            });
        });
    }
}

var sendTeam = (message, team) => {    
    let teamEmbed = new Discord.RichEmbed()
                              .setColor('#0099ff')
                              .setTitle(team.name)
                              .setURL(`https://www.hltv.org/team/${team.id}/${team.name.toLowerCase().replace(/ /g, '-')}`)
                              .setDescription(team.location)
                              .setThumbnail(team.logo)
                              .addField('Rank', team.rank)
                              .addField('Twitter', team.twitter === undefined ? 'No Twitter :(' : team.twitter);

    console.log(team.logo);

    let playerList = '';
    team.players.forEach((player) => {
        playerList += `${player.name} `;
    });
    teamEmbed.addField('Players', playerList);

    teamEmbed.addField('\u200b', 'Recent Matches');

    for (let i = 0; i < RECENT_MATCHES_TO_SHOW && i < team.recentResults.length; i++) {
        let matchResult = team.recentResults[i];
        teamEmbed.addField('\u200b', `${team.name}   ${matchResult.result}   ${matchResult.enemyTeam.name}`);
    }

    message.channel.send(teamEmbed);
}