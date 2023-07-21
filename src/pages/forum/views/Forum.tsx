import { useEffect, useState } from "react";
import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import { Industry } from "../../../common/interfaces/industry";
import { useLocation, useNavigate } from "react-router-dom";
import ForumController from "../controller/ForumController";
import { Forum as ForumProp } from "../../../common/interfaces/forum";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment } from "../../../common/interfaces/comment";
import { Socket } from "socket.io-client";
interface Props {
  socket: Socket;
}
const Forum = ({ socket }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [forums, setForums] = useState<ForumProp[]>([]);
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const updateForum = (action: { index: number; forum: ForumProp }) => {
    const forumsDP = forums.map((mp: ForumProp, index: number) => {
      if (index === action.index) {
        return action.forum;
      } else {
        return mp;
      }
    });

    setForums(forumsDP);
  };
  const fetchForums = async (industryId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ForumController.fetchForums(industryId, page);
    if (response.success) {
      setPage(page + 1);
      setCount(response.data.count);
      setForums(
        response.data.rows.map((mp: ForumProp) => ({
          ...mp,
          coins: mp.coins!.map((cn: any) => cn.userId),
          likes: mp.likes!.map((lk: any) => lk.userId),
        }))
      );
    } else {
      setErr(true);
    }

    setLoading(false);
  };

  const onLike = (args: LikeStruct, postIndex: number) => {
    let forum = forums[postIndex];
    if (forum.likes!.includes(profile?.uid!)) {
      forum = {
        ...forum,

        likes: forum.likes!.filter((ft) => ft !== profile!.uid),
      };
    } else {
      forum = {
        ...forum,
        likes: [...forum.likes!, profile!.uid],
      };
    }
    updateForum({ index: postIndex, forum });
    GeneralPostsController.like(args, socket);
  };

  const onCoin = (args: CoinStruct, postIndex: number) => {
    let forum = forums[postIndex];
    if (forum.coins!.includes(profile?.uid!)) {
      forum = {
        ...forum,
        coins: forum.coins!.filter((ft) => ft !== profile!.uid),
      };
      dispatch(
        saveUserData({
          ...profile!,
          coinscount: profile!.coinscount! + 1,
        })
      );
    } else {
      forum = {
        ...forum,
        coins: [...forum.coins!, profile!.uid],
      };
      dispatch(
        saveUserData({
          ...profile!,
          coinscount: profile!.coinscount! - 1,
        })
      );
    }
    updateForum({ index: postIndex, forum });
    GeneralPostsController.coin(args, socket);
  };

  const onComment = (comment: Comment, postIndex: number) => {
    let forum = forums[postIndex];
    forum = {
      ...forum,
      comments: [...forum.comments!, comment],
    };
    updateForum({ index: postIndex, forum });
  };
  useEffect(() => {
    const state: Industry = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      setIndustry(state);
      fetchForums(state.industryId!);
    }
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title={industry?.industry ?? ""} />
      </div>
      <div className="my-16"></div>
      {industry ? (
        <ForumCard
          banner={industry?.photo!}
          didJoin={false}
          label={industry?.description ?? "Industry description"}
          members={industry?.joinedUsers?.length ?? 0}
          onJoin={() => {}}
          topics={count}
        />
      ) : null}
      {loading ? (
        <FetchStatus
          error={false}
          errorMessage="Something went wrong!!"
          loading={true}
          onReload={() => {}}
        />
      ) : null}
      {err ? (
        <FetchStatus
          error={true}
          errorMessage="Something went wrong!!"
          loading={false}
          onReload={() => {
            fetchForums(industry?.industryId!);
          }}
        />
      ) : null}
      <div className="p-5">
        {forums.map((forum: ForumProp, index: number) => (
          <ForumItem
            onComment={(comment: Comment) => {
              onComment(comment, index);
            }}
            onLike={(postId: string) => {
              onLike(
                {
                  postId,
                  type: "forum",
                  userId: profile!.uid,
                  receiverUid: forum.user!.uid,
                },
                index
              );
            }}
            onCoin={(postId: string) => {
              onCoin(
                {
                  postId,
                  type: "forum",
                  userId: profile!.uid,
                  receiverUid: forum.user!.uid,
                  timestamp: Date.now(),
                },
                index
              );
            }}
            key={forum.forumId}
            data={forum}
          />
        ))}
      </div>
    </div>
  );
};

export default Forum;
