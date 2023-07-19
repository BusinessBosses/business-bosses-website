import { useEffect, useState } from "react";
import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import { Industry } from "../../../common/interfaces/industry";
import { useLocation, useNavigate } from "react-router-dom";
import ForumController from "../controller/ForumController";
import { Forum as ForumProp } from "../../../common/interfaces/forum";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";

const Forum = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [forums, setForums] = useState<ForumProp[]>([]);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const fetchForums = async (industryId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ForumController.fetchForums(industryId, page);
    if (response.success) {
      setPage(page + 1);
      setCount(response.data.count);
      setForums(response.data.rows);
    } else {
      setErr(true);
    }

    setLoading(false);
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
        {forums.map((forum) => (
          <ForumItem key={forum.forumId} data={forum} />
        ))}
      </div>
    </div>
  );
};

export default Forum;
