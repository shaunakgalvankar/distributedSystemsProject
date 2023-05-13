const {Client} = require("pg")
const client = new Client({
    user: "stp",
    host: "localhost",
    database: 'video',
    password: '123',
    port: 5432
})
client.connect();
client.query("select * from users", (err, res) => {
    if (err) throw err;
    client.end();
    console.log(res.rows[0])
})
module.exports = client;