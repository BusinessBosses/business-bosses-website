import { User } from "../../../common/interfaces/user";
import serviceApi from "../../../services/serviceApi"

class ProfileController {
    async fetchUserPosts(userId: string) {
        const response = await serviceApi.fetch(`/post/get-user-posts/${userId}?page=0&size=50`);
        return response;
    }

    

    validateProfileUpdate(data: User) {
        if (!data.username) {
            return 'Invalid Username';
        } else if (!data.email) {
            return 'Invalid Email'
        } else if (!data.bio) {
            return 'Invalid Bio'
        } else {
            return null
        }
    }

    async updateProfile(data: User) {
        const response = await serviceApi.update(`/users/${data.uid}`, data)
        return response;
    }

}


export default new ProfileController()