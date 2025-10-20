/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} status
 * @property {string} timestamp
 * @property {boolean} isOnline
 * @property {number} [unreadCount]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} content
 * @property {string} timestamp
 * @property {'sent' | 'received'} type
 */

/**
 * @typedef {Object} ChatData
 * @property {Contact} contact
 * @property {Message[]} messages
 */

// Export empty object to make this a proper ES module
export {};
