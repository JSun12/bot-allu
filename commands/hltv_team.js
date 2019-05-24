const Discord = require('discord.js');
const request = require('request');
const { HLTV } = require('hltv');

exports.run = async(client, message, args) => {
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
            let teamEmbed = new Discord.RichEmbed()
                              .setColor('#0099ff')
                              .setTitle(team.name)
                              .setURL(`https://www.hltv.org/team/${teamId}/${team.name.toLowerCase().replace(/ /g, '-')}`)
                              .setDescription(team.location)
                              .setThumbnail(team.logo)
                              .addField('Rank', team.rank)
                              .addField('Twitter', team.twitter === undefined ? 'No Twitter :(' : team.twitter);

            let playerList = '';
            team.players.forEach((player) => {
                playerList += `${player.name} `;
            });
            teamEmbed.addField('Players', playerList)
                     .addBlankField();

            teamEmbed.addField('Recent Matches', '\u200b');
            team.recentResults.forEach((matchResult) => {
                teamEmbed.addField(`${team.name}   ${matchResult.result}   ${matchResult.enemyTeam.name}`, matchResult.event.name);
            });

            message.channel.send(teamEmbed);
        });

        getTeamPromise.catch((err) => {
            console.log(err);
            message.channel.send('Error fetching team data.');
        });
    });
}