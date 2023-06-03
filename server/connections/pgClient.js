const Client = require ("pg");

if(!process.env.PostgreSQL_URI){
    throw new Error("PostgreSQL URI must be defined");
}

console.log("Specify Postgres_URI:", process.env.PostgreSQL_URI);

const client = new Client.Client({
    user: "stp",
    host: process.env.PostgreSQL_URI,
    database: 'video',
    password: '123',
    port: 5432
})

module.exports = client;