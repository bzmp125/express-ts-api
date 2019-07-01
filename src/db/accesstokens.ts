const tokens = {};

export default {
    find: (key: string, done: Function) => {
        const token = tokens[key];
        return done(null, token);
    },
    save: (token: string, userID: string, clientID: string, done: Function) => {
        tokens[token] = { userID: userID, clientID: clientID };
        return done(null);
    },
}