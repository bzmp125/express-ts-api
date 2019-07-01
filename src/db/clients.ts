const clients = [
    { id: '1', name: 'Admin', clientId: 'adminapp', clientSecret: 'secret' }
];

export default {
    find: (id: string, done: Function) => {
        const client = clients.filter(client => client.id === id)[0];
        return done(null, client);
    },
    findByClientId: (clientId: string, done: Function) => {
        const client = clients.filter(client => client.clientId === clientId)[0];
        return done(null, client);
    }
}