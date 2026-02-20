import serviceApi from "../../../services/serviceApi"

class ForumController {
    async fetchForums(industryId: string, page: number) {
        const response = await serviceApi.fetch(`/forum/get-industry-forums/${industryId}?size=100&page=${page}`)
        return response;
    }
}


export default new ForumController()