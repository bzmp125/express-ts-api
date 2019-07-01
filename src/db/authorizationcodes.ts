const codes = {};

export default {
    find: (key: string, done: Function) => {
        var code = codes[key];
        return done(null, code);
    },
    save: (code: string, clientID: string, redirectURI: string, userID: string, done: Function) => {
        codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID };
        return done(null);
    },
    delete: (key: string, done: Function) => {
        delete codes[key];
        return done(null);
    }
}