const Discord = require('discord.js');
const { HLTV } = require('hltv');

const TEAMS_TO_DISPLAY = 10;

exports.run = async(client, message, args) => {
    let getRankingPromise = HLTV.getTeamRanking();

    getRankingPromise.then((ranking) => {
        let rankingEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('HLTV Team Ranking')
                            .addBlankField();

        for (let i = 0; i < TEAMS_TO_DISPLAY; i++) {
            let rankChange;
            if (ranking[i].change == 0) {
                rankChange = '---';
            }
            else if (ranking[i].change > 0) {
                rankChange = `+${ranking[i].change}`
            }
            else {
                rankChange = ranking[i].change;
            }

            rankingEmbed
                .addField(`${ranking[i].place}. ${ranking[i].team.name}   ${rankChange}`, `${ranking[i].points} points`);
        }

        message.channel.send(rankingEmbed);
    });

    getRankingPromise.catch((err) => {
        console.log(err);
        message.channel.send('Error fetching team ranking.');
    });
}