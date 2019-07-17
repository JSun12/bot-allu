const Discord = require('discord.js');
const { HLTV } = require('hltv');

const PLAYERS_TO_DISPLAY = 20;

exports.run = async(client, message, args) => {
    let getRankingPromise = HLTV.getPlayerRanking({startDate: 'all'});

    getRankingPromise.then((ranking) => {
        let rankingEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('HLTV Player Ranking')
                            .addBlankField();

        console.log(ranking);

        for (let i = 0; i < PLAYERS_TO_DISPLAY; i++) {
            rankingEmbed.addField(`${i+1}. ${ranking[i].name}`, `Rating: ${ranking[i].rating}`);
        }

        message.channel.send(rankingEmbed);
    });

    getRankingPromise.catch((err) => {
        console.log(err);
        message.channel.send('Error fetching team ranking.');
    });
}