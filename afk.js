const afkUsers = new Map();

/**
 * Set a user as AFK with optional reason
 * @param {string} userId - WhatsApp user ID
 * @param {string} reason - Reason for AFK
 */
function setAfk(userId, reason = 'AFK') {
    afkUsers.set(userId, { reason, time: Date.now() });
}

/**
 * Remove a user's AFK status
 * @param {string} userId
 */
function removeAfk(userId) {
    afkUsers.delete(userId);
}

/**
 * Check if a user is AFK
 * @param {string} userId
 * @returns {boolean}
 */
function isAfk(userId) {
    return afkUsers.has(userId);
}

/**
 * Get AFK data of a user
 * @param {string} userId
 * @returns {{reason: string, time: number} | null}
 */
function getAfk(userId) {
    return afkUsers.get(userId) || null;
}

module.exports = {
    setAfk,
    removeAfk,
    isAfk,
    getAfk
};
