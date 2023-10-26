import express from "express";
import * as mongodb from "mongodb";
import Event from "../models/event";

export async function get(req: express.Request, res: express.Response) {
    var data: any = {
        title: 'Create'
    };

    res.render('create', data);
}

export async function post(req: express.Request, res: express.Response) {
    const now: Date = new Date();
    const name: string = req.body.name;
    const date: Date = new Date(req.body.date);
    const lock: Date = new Date(req.body.lock);
    const price: number = req.body.price;
    const currency: string = req.body.currency;

    var errors: string = '';
    if (date.getTime() < now.getTime()) {
        errors += 'The date must be in the future! ';
    }

    if (lock.getTime() >= date.getTime()) {
        errors += 'Users must be able to join before the event! ';
    }

    if (price < 0) {
        errors += 'The price must be 0 or higher! '
    }

    if (errors.length > 0) {
        res.render('create', {errors: errors});
        return;
    }

    const client: mongodb.MongoClient = new mongodb.MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    const collection: mongodb.Collection<Event> = client.db('secretsanta').collection<Event>('events');

    const event = new Event(name, date, lock, price, currency);
    collection.insertOne(event);

    res.redirect(`/join/${event.code}`)
}