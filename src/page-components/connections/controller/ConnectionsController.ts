import serviceApi from "../../../services/serviceApi"

class ConnectionsController {
    async fetchConnectionsData(userId: string) {
        const response = await serviceApi.fetch(`/connection/data/${userId}`);
        return response;
    }


    async connect(connectedId: string) {
        await serviceApi.post('/connection/connect', {
            timestamp: Date.now(),
            connectedId,
        })
    }

    async disConnect(connectedId: string) {
        await serviceApi.post('/connection/disconnect', {
            connectedId,
        })
    }
}



export default new ConnectionsController()