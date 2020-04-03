const Discord = require('discord.js');
const { HLTV } = require('hltv');

const DEFAULT_PLAYERS_TO_SHOW = 10;

exports.run = async(client, message, args) => {
    let getRankingPromise = HLTV.getPlayerRanking({startDate: 'all'});

    let playersToDisplay = DEFAULT_PLAYERS_TO_SHOW;
    if (args.length > 0) {
        playersToDisplay = args[0];
    }

    getRankingPromise.then((ranking) => {
        let rankingEmbed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle('HLTV Player Ranking');

        console.log(ranking);

        for (let i = 0; i < playersToDisplay; i++) {
            rankingEmbed.addField(`${i+1}. ${ranking[i].name}`, `Rating: ${ranking[i].rating}`);
        }

        message.channel.send(rankingEmbed);
    });

    getRankingPromise.catch((err) => {
        console.log(err);
        message.channel.send('Error fetching team ranking.');
    });
}