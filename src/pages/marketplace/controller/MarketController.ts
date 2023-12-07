import { toast } from "react-toastify";
import serviceApi from "../../../services/serviceApi"
import { Market } from "../../../common/interfaces/Market";

class MarketController {
    markets: Market[] = [];
    async fetchMarkets(page: number) {
        const response = await serviceApi.fetch(`/markets/all?size=20&page=${page}`);
        return response
    }

    async fetchMarketUsers() {
        const response = await serviceApi.fetch(`/members/marketplace`);
        return response
    }


    async createListing(args: MarketStruct) {
        const response = await serviceApi.post('/markets', args);
        return response;
    }

    async updateListing(postId: string, args: MarketStruct) {
        const response = await serviceApi.update(`/markets/${postId}`, args);
        return response;
    }

    async deletelisting(postId: string){
        await serviceApi.remove(`/markets/${postId}`)
    }

    validatePostField(post: MarketStruct): boolean {
        if (!!!post.description && !!!post.images?.length) {
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



export default new MarketController()

interface MarketStruct {
    description?: string,
    images?: string[],
    category?: string,
    price?: string,
    location?: string,
    timestamp?: number
    discount?: string,
}

