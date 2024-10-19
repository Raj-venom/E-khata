import conf from '../conf/conf';
import { Client, Databases } from "appwrite";

class Dashboard {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async getTotalAmounts() {
        try {
            const totalPartyAmount = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.partyCollectionId,
                []
            );

            const totalCustomerAmount = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.customerCollectionId,
                []
            );

            const totalPartySum = totalPartyAmount.documents.reduce((acc, doc) => acc + (doc.remaining_amount || 0), 0);
            const totalCustomerSum = totalCustomerAmount.documents.reduce((acc, doc) => acc + (doc.remaining_amount || 0), 0);

            return {
                totalPartyAmount: totalPartySum,
                totalCustomerAmount: totalCustomerSum
            };
        } catch (error) {
            console.error('Error fetching total amounts:', error);
            throw error;
        }
    }

}

const dashboardApi = new Dashboard();

export default dashboardApi;