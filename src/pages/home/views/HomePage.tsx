import MobileBossOfTheWeek from "./components/MobileBossOfTheWeek";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileHeader from "./components/MobileHeader";
import PostItem from "./components/PostItem";
const HomePage = () => {
  return (
    <div className=" ">
      <MobileHeader />
      <div className="mt-20">
        <MobileBossOfTheWeek />
      </div>
      <div className="p-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
          <PostItem key={post} />
        ))}
      </div>
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={0} />
    </div>
  );
};

export default HomePage;
