const Discord = require('discord.js');
const fs = require('fs');
const mongodb = require('mongodb').MongoClient;
const config = require('./config.json');

const client = new Discord.Client(); 

client.once('ready', () => {
    console.log('EZ4ENCE');
});

client.login(config.token);

// resolve available command modules and map it to command name
client.availableCommands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (var fileName of commandFiles) {
    const commandModule = require(`./commands/${fileName}`);

    // removes the last 3 characters in the file name (file extension)
    let commandName = fileName.slice(0, -3);

    client.availableCommands.set(commandName, commandModule);
}

client.on('message', message => {
    if (!message.content.startsWith(config.prefix)) {
        return;
    }

    mongodb.connect(config.databaseUrl, (err, client) => {
        if (err) {
            message.channel.send('CHANGE THIS TO AN ACTUAL ERROR MESSAGE');
        }
        let db = client.db("botdb");
        let found = db.collection('config').find({'_id': message.guild.id}).count();
        found.then((numItems) => {
            if (numItems == 0) {
                let newServerConfig = {_id: message.guild.id, 'teamChannels': []};
                db.collection('config').insertOne(newServerConfig, (err, res) => {
                    if (err) {
                        message.channel.send('CHANGE THIS TO AN ACTUAL ERROR MESSAGE');
                    }
                    console.log('Server config saved...');
                    client.close();
                });
            }
        })
        
    });

    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    let cmd = args.shift();

    try {
        let cmdModule = client.availableCommands.get(cmd);
        cmdModule.run(client, message, args);
    } catch (err) {
        message.channel.send('Invalid Command!');
        console.error(err);
    }
});
