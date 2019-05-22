const mongodb = require('mongodb').MongoClient;
const config = require('../config.json');
const utils = require('../utils.js');

exports.run = async(client, message, args) => {
    if (args.length < 2) {
        message.channel.send('You need more friends...');
        return;
    }

    let users = [];
    getUsersFromMentions(message, args, users);

    let voiceChannels = utils.getVoiceChannels(client);
    
    mongodb.connect(config.databaseUrl, (err, dbClient) => {
        if (err) {
            message.channel.send('Error fetching server channels.');
            console.log(err);
            return;
        }

        let db = dbClient.db("botdb");
        db.collection('config').findOne({_id: message.guild.id}, (err, res) => {
            if (err) {
                message.channel.send('Error fetching server channels.');
                console.log(err);
                return;
            }

            teamChannels = res.teamChannels;
            dbClient.close();

            let teamA = [];
            let teamB = [];

            shuffleTeams(users, teamA, teamB);

            let teamAChannel = voiceChannels[res.teamChannels[0]].id;
            let teamBChannel = voiceChannels[res.teamChannels[1]].id;

            teamA.forEach((user) => {
                user.setVoiceChannel(teamAChannel);
            });

            teamB.forEach((user) => {
                user.setVoiceChannel(teamBChannel);
            });

            message.channel.send('Teams shuffled to: ' + res.teamChannels[0] + ' and ' + res.teamChannels[1]);
        });
    });
}

var shuffleTeams = (arr, teamA, teamB) => {
    arr.sort(() => Math.random() - 0.5);
    let mid = Math.ceil(arr.length / 2);
    for (let i = 0; i < arr.length; i++) {
        if (i < mid) {
            teamA.push(arr[i]);
        }
        else {
            teamB.push(arr[i]);
        }
    }
}
var getUsersFromMentions = (message, mentions, users) => {
    mentions.forEach((mention) => {
        let id = mention.replace(/\D/g,'');
        let user = message.guild.members.get(id);
        users.push(user);
    });
}