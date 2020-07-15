import dotenv from "dotenv";
import express from "express";
import { AddressInfo } from "net";
import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());

app.use(routes);

const server = app.listen(3000, ()=>{
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
});