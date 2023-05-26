import { Client } from "pg";
// if(!process.env.PostgreSQL_URI){
//     throw new Error("PostgreSQL URI must be defined");
// }
const client = new Client({
    user: "stp",
    // host: process.env.PostgreSQL_URI,
    host:'localhost',
    database: 'video',
    password: '123',
    port: 5432
})

export default client;