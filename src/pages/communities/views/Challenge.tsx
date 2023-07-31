import { useEffect, useState } from "react";
import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import { Forum } from "../../../common/interfaces/forum";
import { Industry } from "../../../common/interfaces/industry";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import GeneralPostsController, {
  CoinStruct,
  LikeStruct,
} from "../../../common/controllers/GeneralPostsController";
import { saveUserData } from "../../../redux/slices/UserSlice";
import { Comment } from "../../../common/interfaces/comment";
import { updateForum } from "../../../redux/slices/ForumSlice";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import serviceApi from "../../../services/serviceApi";
interface Props {
  forums: Forum[];
  socket: Socket;
}
const Challenge = ({ forums, socket }: Props) => {
  const [industry, setIndustry] = useState<Industry | null>(null);
  const industries = useAppSelector((state) => state.industry.industries);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const forumsState = useAppSelector((state) => state.forum.forums);
  const profile = useAppSelector((state) => state.user.profile);

  const onLike = (args: LikeStruct, postIndex: number) => {
    let forum = forumsState[postIndex];
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
    dispatch(updateForum({ index: postIndex, forum }));
    GeneralPostsController.like(args, socket);
  };

  const onCoin = (args: CoinStruct, postIndex: number) => {
    let forum = forumsState[postIndex];
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
    dispatch(updateForum({ index: postIndex, forum }));
    GeneralPostsController.coin(args, socket);
  };

  const onComment = (comment: Comment, postIndex: number) => {
    let forum = forumsState[postIndex];
    forum = {
      ...forum,
      comments: [...forum.comments!, comment],
    };
    dispatch(updateForum({ index: postIndex, forum }));
  };

  useEffect(() => {
    const filteredIndustries = CommunitiesController.getIndustriesByCategory(
      industries,
      AppConstants.BOSS_UP_CHALLENGE_CATEGORY_ID
    );
    if (!!filteredIndustries.length) {
      setIndustry(filteredIndustries[0]);
    }
  }, [industries]);
  const joinIndustry = async () => {
    if (!!industry?.joinedUsers?.includes(profile!.uid)) {
      const newJoinedUsers = industry.joinedUsers.filter(
        (ft) => ft !== profile?.uid
      );
      setIndustry({ ...industry, joinedUsers: newJoinedUsers });
    } else {
      setIndustry({
        ...industry,
        joinedUsers: [...industry?.joinedUsers!, profile!.uid],
      });
    }
    await serviceApi.update(
      `/industry/join-leave-industry/${industry?.industryId}`
    );
  };
  return (
    <div>
      <div className="mobile-only">
      <ForumCard
        onCreate={() => {
          navigate(RoutesPath.CreateBossup, {
            state: { industryId: industry?.industryId },
          });
        }}
        createLabel="Enter Challenge"
        banner={industry?.photo!}
        didJoin={!!industry?.joinedUsers?.includes(profile!.uid)}
        label={industry?.description ?? "Industry Description"}
        members={industry?.joinedUsers?.length ?? 0}
        onJoin={joinIndustry}
        topics={20}
      />
      </div>
      <div className="">
        {forums.map((forum: Forum, index: number) => (
          <ForumItem
            onEdit={() => {
              navigate(RoutesPath.CreateBossup, {
                state: {
                  post: forum,
                },
              });
            }}
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

export default Challenge;
