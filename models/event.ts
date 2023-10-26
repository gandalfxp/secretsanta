import * as mongodb from 'mongodb';

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
}