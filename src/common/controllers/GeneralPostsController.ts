import { Socket } from "socket.io-client"
import serviceApi from "../../services/serviceApi"

class GeneralPostsController {
    like(args: LikeStruct, socket: Socket) {
        socket.emit('like', args)
    }


    coin(args: CoinStruct, socket: Socket) {
        socket.emit('coin', args)
    }

    async comment(args: CommentStruct) {
        await serviceApi.post('/comments', args);
    }

    async addView(args: ViewStruct) {
        await serviceApi.update('/post/update-post/'+ args.postId, args);
    }

    async addForumView(args: ViewStruct) {
        await serviceApi.update('/forum/update/'+ args.postId, args);
    }

    async reportPost(args: ReportStruct) {
        await serviceApi.post('/reportedpost', args);
    }

    async blockUser(args: ReportStruct) {
        await serviceApi.post('/blockedpost', args);
    }

    async fetchComments(postId: string) {
        const response = await serviceApi.fetch(`/comments/post/${postId}`);
        return response;
    }



}


export interface LikeStruct {
    postId: string,
    userId: string,
    type: string,
    receiverUid?: string
}

interface ReportStruct {
    postId: string,
    reason?: string
}


export interface CoinStruct {
    postId: string,
    userId: string,
    type: string,
    timestamp: number,
    receiverUid?: string
}

export interface ViewStruct {
    postId: string,
    views: number,
}


interface CommentStruct {
    postId: string,
    comment: string,
    timestamp: number,
    receiverUid: string
}




export default new GeneralPostsController()