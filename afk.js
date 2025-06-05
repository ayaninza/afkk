const fs = require('fs');

const afkFile = './afk.json';

let afkData = fs.existsSync(afkFile) ? JSON.parse(fs.readFileSync(afkFile)) : {};

function saveAFK() {
    fs.writeFileSync(afkFile, JSON.stringify(afkData, null, 2));
}

function setAFK(userId, reason) {
    afkData[userId] = reason;
    saveAFK();
}

function removeAFK(userId) {
    if (afkData[userId]) {
        delete afkData[userId];
        saveAFK();
        return true;
    }
    return false;
}

function checkAFK(userId) {
    return afkData[userId] || null;
}

module.exports = {
    setAFK,
    removeAFK,
    checkAFK
};