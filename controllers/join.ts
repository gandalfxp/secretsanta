import express from "express";
import * as mongodb from "mongodb";
import Participant from "../models/participant";
import Event from "../models/event";

export async function get(req: express.Request, res: express.Response) {
    const event: mongodb.WithId<Event> = await Event.get(req.params.code);

    if (event == null) {
        res.render('message', {
            title: '404: Not found',
            description: "The event you're looking for, doesn't exist..."
        })
        return;
    }
    
    res.render('join', {code: event.code, name: event.name});
}

export async function post(req: express.Request, res: express.Response) {
    const event: mongodb.WithId<Event> = await Event.get(req.params.code);
    const email: string = req.body.email;

    if (event == null) {
        res.render('message', {
            title: '404: Not found',
            description: "The event you're looking for, doesn't exist..."
        })
        return;
    }

    const client: mongodb.MongoClient = new mongodb.MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    const collection: mongodb.Collection<Participant> = client.db('secretsanta').collection<Participant>('participants');
    const participant: mongodb.WithId<Participant> = await collection.findOne({code: event.code, email: email}) as mongodb.WithId<Participant>;
    
    if (participant != null) {
        res.render('message', {
            title: '403: Forbidden',
            description: `You have already joined ${event.name}...`
        });
        return;
    };

    const name: string = req.body.name;
    const wish: string = req.body.wish;
    const newParticipant: Participant = new Participant(name, email, wish, event.code);
    await collection.insertOne(newParticipant);
    
    res.render('message', {
        title: 'Joined!',
        description: `You have joined ${event.name}. Thank you <3`
    });
}