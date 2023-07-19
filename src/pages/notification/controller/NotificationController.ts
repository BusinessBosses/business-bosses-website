import serviceApi from "../../../services/serviceApi"

class NotificationController {
    async fetchNotifications(page: number) {
        const response = await serviceApi.fetch(`/notification?page=${page}&size=30`);
        return response;
    }
}



export default new NotificationController()