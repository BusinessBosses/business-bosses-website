import serviceApi from "../../../services/serviceApi"

class ConnectionsController {
    async fetchConnectionsData(userId: string) {
        const response = await serviceApi.fetch(`/connection/data/${userId}`);
        return response;
    }
}



export default new ConnectionsController()