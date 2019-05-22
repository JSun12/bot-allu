const mongodb = require('mongodb').MongoClient;
const config = require('../config.json');
const utils = require('../utils.js');

exports.run = async(client, message, args) => {
    if (args.length != 2) {
        message.channel.send('Please choose exactly 2 voice channels.');
        return;
    }

    let voiceChannels = utils.getVoiceChannels(client);

    for (var i = 0; i < 2; i++) {
        console.log(args[i]);
        if (!(args[i] in voiceChannels)) {
            message.channel.send(`Voice channel ${args[i]} doesn't exist in the server.`);
            return;
        }
    }

    mongodb.connect(config.databaseUrl, (err, dbClient) => {
        if (err) {
            message.channel.send('Error storing server team channels.');
            console.log(err);
            return;
        }

        let db = dbClient.db("botdb");
        db.collection('config')
            .update({_id: message.guild.id}, {$set: {'teamChannels': args}});
        dbClient.close();
        message.channel.send('Team channels have been set.');
    });
}