exports.getVoiceChannels = (client) => {
    let voiceChannels = {};
    client.channels.forEach((value, key, map) =>{
        if (value.type === 'voice') {
            voiceChannels[value.name] = value;
        }
    });

    return voiceChannels;
}