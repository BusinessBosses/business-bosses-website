import { toast } from "react-toastify";
import serviceApi from "../../../services/serviceApi"

class CreatePostController {
    async createPost(args: PostStruct) {
        const response = await serviceApi.post('/post/create-post', args);
        return response;
    }

    async updatePost(postId: string, title: string) {
        const response = await serviceApi.update(`/post/update-post/${postId}`, {
            title,
        });
        return response;
    }

    validatePostField(post: PostStruct): boolean {
        if (!!!post.title && !!!post.images?.length) {
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

interface PostStruct {
    title: string,
    timestamp: number,
    images?: string[]
}


export default new CreatePostController()