import * as mongodb from 'mongodb';
import Participant from './participant';

export default class Event {
    public name: string;
    public date: Date;
    public lock: Date;
    public price: number;
    public currency: string;
    public code: string;

    /**
     * Creates a new event and automatically generates a new code for it.
     * 
     * @param name Name of the event
     * @param date Date of the event
     * @param lock When lock occurs, participants will be assigned, event gets deleted
     * @param price Gifts should cost around this price
     * @param currency Currency of price
     */
    constructor(name: string, date: Date, lock: Date, price: number, currency: string) {
        this.name = name;
        this.date = date;
        this.lock = lock;
        this.price = price;
        this.currency = currency;
        this.code = this.generateCode();
    }

    /**
     * Randomly generates an access code for the event.
     */
    private generateCode(): string {
        const charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var code: string = '';
    
        for (let i = 0; i < 10; i++) {
            code += charset[Math.floor(Math.random() * charset.length)];
        }
    
        return code;
    }

    /**
     * Gets an event by its access code. If no event has been found, event will
     * be null.
     * 
     * @param code Access code of the event
     */
    public static async get(code: string): Promise<mongodb.WithId<Event>> {
        const client = new mongodb.MongoClient(process.env.MONGO_URI as string);
        await client.connect();
        const collection: mongodb.Collection<Event> = client.db('secretsanta').collection<Event>('events');

        return await collection.findOne({code: code}) as mongodb.WithId<Event>;
    }

    /**
     * Removes an event by its access code.
     * 
     * @param code Access code of the event
     */
    public static async remove(code: string): Promise<void> {
        const client = new mongodb.MongoClient(process.env.MONGO_URI as string);
        await client.connect();
        const collection: mongodb.Collection<Event> = client.db('secretsanta').collection<Event>('events');

        await collection.deleteOne({code: code});
    }

    /**
     * Deletes all participants that joined an event.
     * 
     * @param code Access code of the event
     */
    public static async removeParticipants(code: string): Promise<void> {
        const client = new mongodb.MongoClient(process.env.MONGO_URI as string);
        await client.connect();
        const collection: mongodb.Collection<Event> = client.db('secretsanta').collection<Event>('participants');

        await collection.deleteMany({code: code});
    }

    /**
     * Assigns each participant that joined an event another participant. Each
     * participant can only be assigned once.
     * 
     * @param code Access code of the event
     * @returns Promise of an array containing tuples of participants
     */
    public static async assignParticipants(code: string): Promise<[Participant, Participant][]> {
        const client = new mongodb.MongoClient(process.env.MONGO_URI as string);
        await client.connect();
        const collection: mongodb.Collection<Participant> = client.db('secretsanta').collection<Participant>('participants');
        const participants: Participant[] = await collection.find({code: code}).toArray();

        var assigned: Participant[] = [];
        var pairs: [Participant, Participant][] = [];
    
        for (let i = 0; i < participants.length; i++) {
            var assigning: Participant = participants[i];
    
            while (assigning == participants[i] || assigned.includes(assigning)) {
                assigning = participants[Math.floor(Math.random() * participants.length)];
            }
    
            assigned.push(assigning);
            pairs.push([participants[i], assigning]);
        }
    
        return pairs;
    }
}