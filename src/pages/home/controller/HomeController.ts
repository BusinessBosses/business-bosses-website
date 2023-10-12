import { Forum } from "../../../common/interfaces/forum";
import { Post } from "../../../common/interfaces/post";
import { MixedPostState } from "../../../redux/slices/PostSlice";
import serviceApi from "../../../services/serviceApi";

class HomeController {
    processData(response: any): MixedPostState[] {
        let frms = [];
        let psts = [];
        const posts = response.data.posts.posts.rows.map((mp: Post) => ({
            ...mp,
            coins: mp.coins.map((cn: any) => cn.userId),
            likes: mp.likes.map((lk: any) => lk.userId),
        }));
        const forums = response.data.posts.forums.rows.map((mp: Forum) => ({
            ...mp,
            coins: mp.coins!.map((cn: any) => cn.userId),
            likes: mp.likes!.map((lk: any) => lk.userId),
        }));
        

        for (let index = 0; index < posts.length; index++) {
            psts.push({ isForum: false, data: posts[index] });
        }

        for (let index = 0; index < forums.length; index++) {
            frms.push({ isForum: true, data: forums[index] });
        }

        const mixedData: MixedPostState[] = [...frms, ...psts].sort(
            (a, b) => b.data.timestamp - a.data.timestamp
        );

        return mixedData;
    }





   
}



export default new HomeController()