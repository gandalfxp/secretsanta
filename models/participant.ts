import * as mongodb from 'mongodb';

export default class Participant {
    public name: string;
    public email: string;
    public wish: string;
    public code: string;

    /**
     * Creates a new participant.
     * 
     * @param name Name of the participant
     * @param email Email address of the participant
     * @param wish Wish(es) of the participant
     * @param code Access code of the event
     */
    constructor(name: string, email: string, wish: string, code: string) {
        this.name = name;
        this.email = email;
        this.wish = wish;
        this.code = code;
    }

    /**
     * Gets a participant by its email and access code. I no participant has
     * been found, participant will be null.
     * 
     * @param code Access code of the event
     * @param email email address of the participant
     */
    public static async get(code: string, email: string): Promise<mongodb.WithId<Participant>> {
        const client = new mongodb.MongoClient(process.env.MONGO_URI as string);
        await client.connect();
        const collection: mongodb.Collection<Participant> = client.db('secretsanta').collection<Participant>('participants');

        return await collection.findOne({code: code, email: email}) as mongodb.WithId<Participant>;
    }
}