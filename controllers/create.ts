import express from "express";
import * as mongodb from "mongodb";
import * as schedule from "node-schedule";
import * as nodemailer from "nodemailer";
import Event from "../models/event";
import Participant from "../models/participant";

export async function get(req: express.Request, res: express.Response) {
    var data: any = {
        title: 'Create'
    };

    res.render('create', data);
}

async function mailParticipants(pair: [Participant, Participant], event: Event): Promise<void> {
    const account: nodemailer.TestAccount = await nodemailer.createTestAccount();
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });

    const message: nodemailer.SendMailOptions = {
        from: '"System" <secretsanta@example.com>',
        to: pair[0].email,
        subject: `Secret santa: ${Event.name}`,
        text: `Dear ${pair[0].name},
        
        thank you for joining ${Event.name}! You have been assigned to get a gift
        for ${pair[1].name}. ${pair[1].name} wishes for:
        
        ${pair[1].wish}
        
        Please remember that a gift should cost around ${event.price}${event.currency}.`
    };

    await transporter.sendMail(message);
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

    schedule.scheduleJob(event.lock, async () => {
        const pairs: [Participant, Participant][] = await Event.assignParticipants(event.code);

        for (let i = 0; i < pairs.length; i++) {
            mailParticipants(pairs[i], event);
        }

        await Event.removeParticipants(event.code);
        await Event.remove(event.code);
    })

    res.redirect(`/join/${event.code}`)
}