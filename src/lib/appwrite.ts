import {Client, Databases, Users, Storage, Account} from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

export const databases = new Databases(client);
export const users = new Users(client);
export const storage = new Storage(client);
export const account = new Account(client);
export default client;