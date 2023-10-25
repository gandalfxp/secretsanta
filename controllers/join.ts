import express from "express";
import { MongoClient } from "mongodb";
import { participant, event } from "../types"

async function eventExists(code: string): Promise<false | event> {
    const client: MongoClient = new MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    const collection = client.db('secretsanta').collection<event>('events');
    const event: event = await collection.findOne({code: code}) as event;

    if (event == null) {
        return false;
    }

    return event;
}

export async function get(req: express.Request, res: express.Response) {
    const event = await eventExists(req.params.code);

    if (!event) {
        res.sendStatus(404);
        return;
    }
    
    res.render('join', {code: event.code, name: event.name});
}

export async function post(req: express.Request, res: express.Response) {
    const event = await eventExists(req.params.code);

    if (!event) {
        res.sendStatus(404);
        return;
    }

    const client: MongoClient = new MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    const collection = client.db('secretsanta').collection<participant>('participants');

    const name: string = req.body.name;
    const email: string = req.body.email;
    const wish: string = req.body.wish;
    const joinedAt: number = Date.now() / 1000;

    var participant: participant = await collection.findOne({code: event.code, email: email}) as participant;
    
    if (participant != null) {
        res.sendStatus(403);
        return;
    }

    participant = {
        name: name,
        email: email,
        code: event.code,
        joinedAt: joinedAt,
        wish: wish
    }

    await collection.insertOne(participant);
    res.sendStatus(200);
}