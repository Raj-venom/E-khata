import conf from '../conf/conf';
import { Client, ID, Databases, Query } from "appwrite";

class Party {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getAllParties(showRemainingAmountOnly: boolean, searchTerm: string, paidAmountUserOnly: boolean) {
        try {
            const queries = []

            if (showRemainingAmountOnly) {
                queries.push(Query.greaterThan('remaining_amount', 0))
            }

            if (searchTerm) {
                queries.push(Query.or([
                    Query.contains('name', searchTerm),
                    Query.contains('phone', searchTerm),
                ]))
            }

            if (paidAmountUserOnly) {
                queries.push(Query.lessThanEqual('remaining_amount', 0))
            }

            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.partyCollectionId,
                [
                    Query.limit(10000),
                    Query.offset(0),
                    Query.orderAsc('remaining_amount'),

                    ...queries
                ]

            );
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
