import serviceApi from "../../../services/serviceApi"

class ProfileController {
    async fetchUserPosts(userId: string) {
        const response = await serviceApi.fetch(`/post/get-user-posts/${userId}?page=0&size=50`);
        return response;
    }
}


export default new ProfileController()