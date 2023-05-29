import client from './connections/pgClient';
import {DatabaseConnectionError} from '@wyf-ticketing/wyf';
import {app} from "./app";

const start = async () => {
    console.log('Starting Up')
    if(!process.env.JWT_SECRET) {
        throw new Error('Secret doesn\'t exist');
    }
    try{
        await client.connect();
        console.log('Connected to Postgres');
    }catch (err) {
        console.error(err);
        new DatabaseConnectionError("Error connected to Postgres.");
    }
    console.log()
}
app.listen(3000,()=>{
    console.log(('Listening on port 3000!!!'));
});

start();