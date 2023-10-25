import { config } from "dotenv";
import express from "express";
import { router } from "./router";

config();

const app = express();
const IP: string = process.env.IP as string;
const PORT: number = process.env.PORT as unknown as number;

app.use('/public', express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({extended: false}));
app.use(router);

app.listen(PORT, IP, () => {
    console.log('listening');
});