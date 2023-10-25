import express from "express";
import { MongoClient } from "mongodb";
import { event } from "../types"

export async function get(req: express.Request, res: express.Response) {
    var data: any = {
        title: 'Create'
    };

    res.render('create', data);
}

function dateToSeconds(date: string): number {
    return Math.floor(new Date(date).getTime() / 1000)
}

function generateCode(length: number): string {
    const charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code: string = '';

    for (let i = 0; i < length; i++) {
        code += charset[Math.floor(Math.random() * charset.length)];
    }

    return code;
}

export async function post(req: express.Request, res: express.Response) {
    const now: number = Date.now() / 1000;
    const name: string = req.body.name;
    const date: number = dateToSeconds(req.body.date);
    const joinUntil: number = dateToSeconds(req.body.joinUntil);
    const price: number = req.body.price;
    const currency: string = req.body.currency;

    var errors: string = '';
    if (date < now) {
        errors += 'The date must be in the future! ';
    }

    if (joinUntil >= date) {
        errors += 'Users must be able to join before the event! ';
    }

    if (price < 0) {
        errors += 'The price must be 0 or higher! '
    }

    if (errors.length > 0) {
        res.render('create', {errors: errors});
        return;
    }

    const client: MongoClient = new MongoClient(process.env.MONGO_URI as string);
    await client.connect();

    const event: event = {
        name: name,
        date: date,
        joinUntil: joinUntil,
        price: price,
        currency: currency,
        code: generateCode(8)
    };

    const collection = client.db('secretsanta').collection('events');
    collection.insertOne(event);

    res.redirect(`/join/${event.code}`)
}