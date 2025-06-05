const { Client, LegacySessionAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode');
const afk = require('./afk');

let sessionData = fs.existsSync('./session.json') ? require('./session.json') : null;

const client = new Client({
    authStrategy: new LegacySessionAuth({ session: sessionData }),
    puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', async (qr) => {
    try {
        await qrcode.toFile('qr.png', qr);
        console.log('QR code saved as qr.png - please download this file from Railway and scan it with your phone.');
    } catch (err) {
        console.error('Failed to generate QR code image:', err);
    }
});

client.on('message', async msg => {
    const sender = msg.author || msg.from;

    // If sender was AFK and now sends a message, remove AFK and notify
    if (afk.isAfk(sender)) {
        afk.removeAfk(sender);
        msg.reply("Welcome back! You're no longer AFK.");
    }

    // If message is '.afk' command
    if (msg.body.startsWith('.afk')) {
        const reason = msg.body.split(' ').slice(1).join(' ') || "No reason.";
        afk.setAfk(sender, reason);
        msg.reply(`AFK set: ${reason}`);
    }
});

client.on('message_create', async msg => {
    if (msg.mentionedIds && msg.mentionedIds.length > 0) {
        msg.mentionedIds.forEach(id => {
            if (afk.isAfk(id)) {
                const data = afk.getAfk(id);
                msg.reply(`User is AFK: ${data.reason}`);
            }
        });
    }
});

client.on('authenticated', session => {
    fs.writeFileSync('./session.json', JSON.stringify(session));
});

client.initialize();
