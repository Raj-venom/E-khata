import conf from '../conf/conf';
import { Client, ID, Databases } from "appwrite";

class Party {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getAllParties() {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.partyCollectionId);
        } catch (error) {
            console.log("Appwrite service :: getAllParties :: error", error);
        }
    }

    async getPartyById(id: string) {
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId, conf.partyCollectionId, id);
        } catch (error) {
            console.log("Appwrite service :: getPartyById :: error", error);
        }
    }

    async createParty(data: any) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.partyCollectionId, ID.unique(), data);
        } catch (error) {
            console.log("Appwrite service :: createParty :: error", error);
        }
    }

    async updateParty(id: string, data: any) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.partyCollectionId, id, data);
        } catch (error) {
            console.log("Appwrite service :: updateParty :: error", error);
        }
    }
}

const partyApi = new Party();

export default partyApi;
