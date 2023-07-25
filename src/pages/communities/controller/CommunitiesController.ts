import { toast } from "react-toastify"
import { Industry } from "../../../common/interfaces/industry"
import AppConstants from "../../../constants/consts"
import serviceApi from "../../../services/serviceApi"
import ForumController from "../../forum/controller/ForumController"

class CommunitiesController {
    async fetchData() {
        const industries = await serviceApi.fetch('/industry/get')
        const forums = await ForumController.fetchForums(AppConstants.BOSSUPINDUSTRYID, 0)
        return { forums, industries }
    }

    getIndustriesByCategory(industries: Industry[], categoryId: string): Industry[] {
        const filteredIndustries: Industry[] = industries.filter((ft) => ft.categoryId === categoryId);
        return filteredIndustries;
    }



    async createBossup(args: BossupStruct) {
        const response = await serviceApi.post('/forum/create', args);
        return response;
    }

    async updateBossup(postId: string, args: BossupStruct) {
        const response = await serviceApi.update(`/forum/update/${postId}`, args);
        return response;
    }

    validatePostField(post: BossupStruct): boolean {
        if (!!!post.description || !!!post.industryId || !!!post.title) {
            return false;
        } else {
            return true;
        }
    }

    checkFileSize(file: File): boolean {
        const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to megabytes
        return fileSizeInMB > 5;
    }

    async uploadFiles(files: File[]) {
        let fileUrls: string[] = [];
        for (let index = 0; index < files.length; index++) {
            if (this.checkFileSize(files[index])) {
                toast.error('Image size should be maximum 5 MB.')
                return null
            } else {
                const response = await serviceApi.uploadFile(files[index]);
                if (response) {
                    fileUrls.push(response.fileUrl)
                } else {
                    return null;
                }
            }
        }

        return fileUrls;
    }




}


export default new CommunitiesController()


interface BossupStruct {
    title: string,
    description: string,
    industryId?: string,
    timestamp?: number,
    images?: string[]
}