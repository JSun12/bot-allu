exports.run = async(client, message, args) => {
    let resp = 'Bot received test command with args:';
    for (var i in args) {
        resp += ' ' + args[i];
    }

    message.channel.send(resp);
}