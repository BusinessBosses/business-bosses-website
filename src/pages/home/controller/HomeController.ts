import { Forum } from "../../../common/interfaces/forum";
import { Post } from "../../../common/interfaces/post";
import { MixedPostState } from "../../../redux/slices/PostSlice";
import serviceApi from "../../../services/serviceApi";

class HomeController {

    processData(response: any): MixedPostState[] {
        let frms = [];
        let psts = [];
        let promotedpsts = [];
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
        const promotedPosts = response.data.posts.promotedPosts.rows.map((mp: Post) => ({
            ...mp,
            coins: mp.coins.map((cn: any) => cn.userId),
            likes: mp.likes.map((lk: any) => lk.userId),
        }));
    
        for (let index = 0; index < posts.length; index++) {
            psts.push({ isForum: false, data: posts[index] });
        }
    
        for (let index = 0; index < forums.length; index++) {
            frms.push({ isForum: true, data: forums[index] });
        }
    
        // Create an array to hold the repeated promoted posts
        const repeatedPromotedPosts: MixedPostState[] = [];
    
        // Calculate the total number of regular posts
        const totalRegularPosts = frms.length + psts.length;
    
        // Calculate the interval based on the total number of regular posts and promoted posts
        const interval = Math.ceil(totalRegularPosts / promotedPosts.length);
    
        // Repeat each promoted post at intervals, but limit to a maximum of 3 times
        for (let i = 0; i < promotedPosts.length; i++) {
            for (let j = 0; j < Math.min(3, interval); j++) {
                repeatedPromotedPosts.push({ isForum: false, data: promotedPosts[i] });
            }
        }
    
        // Sort only the regular posts (frms and psts) based on timestamp
        frms.sort((a, b) => b.data.timestamp - a.data.timestamp);
        psts.sort((a, b) => b.data.timestamp - a.data.timestamp);
    
        const mixedData: MixedPostState[] = [];
        let promotedIndex = 0;
    
        // Interleave promoted posts with other posts and forums
        for (let i = 0; i < totalRegularPosts; i++) {
            if (i < frms.length) mixedData.push(frms[i]);
            if (i < psts.length) mixedData.push(psts[i]);
    
            // Insert repeated promoted posts at intervals
            if (promotedIndex < repeatedPromotedPosts.length) {
                mixedData.push(repeatedPromotedPosts[promotedIndex]);
                promotedIndex++;
            }
        }
    
        return mixedData;
    }

    

    processnewData(response: any): MixedPostState[] {
        let frms = [];
        let psts = [];
        let promotedpsts = [];
        const posts = response.data.posts.rows.map((mp: Post) => ({
            ...mp,
            coins: mp.coins.map((cn: any) => cn.userId),
            likes: mp.likes.map((lk: any) => lk.userId),
        }));
        const forums = response.data.forums.rows.map((mp: Forum) => ({
            ...mp,
            coins: mp.coins!.map((cn: any) => cn.userId),
            likes: mp.likes!.map((lk: any) => lk.userId),
        }));

       if (response.data.posts.promotedPosts) {
            const promotedPosts = response.data.posts.promotedPosts.rows.map((mp: Post) => ({
                ...mp,
                coins: mp.coins.map((cn: any) => cn.userId),
                likes: mp.likes.map((lk: any) => lk.userId),
            }));

            for (let index = 0; index < promotedPosts.length; index++) {
                promotedpsts.push({ isForum: false, data: promotedPosts[index] });
            }
        }


        for (let index = 0; index < posts.length; index++) {
            psts.push({ isForum: false, data: posts[index] });
        }

        for (let index = 0; index < forums.length; index++) {
            frms.push({ isForum: true, data: forums[index] });
        }

        // for (let index = 0; index < promotedPosts.length; index++) {
        //     promotedpsts.push({ isForum: false, data: promotedPosts[index] });
        // }

        const mixedData: MixedPostState[] = [...promotedpsts,...frms, ...psts].sort(
            (a, b) => b.data.timestamp - a.data.timestamp
        );

        return mixedData;
    }





   
}



export default new HomeController()