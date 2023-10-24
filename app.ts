import express from "express";
import { router } from "./router";

const app = express();

app.use('/public', express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

app.use(router)

app.listen(80, '127.0.0.1', () => {
    console.log('listening');
});