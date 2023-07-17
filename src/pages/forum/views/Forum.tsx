import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";

const Forum = () => {
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Forum" />
      </div>
      <div className="my-16"></div>
      <ForumCard
        banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
        didJoin={false}
        label="Ideas on how to create things easily"
        members={20}
        onJoin={() => {}}
        topics={20}
      />
      <div className="p-5">
        {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
          <ForumItem key={post} />
        ))} */}
      </div>
    </div>
  );
};

export default Forum;
