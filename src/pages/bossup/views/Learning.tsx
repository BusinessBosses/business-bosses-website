import LearningCard from "./components/LearningCard";

const Learning = () => {
  return (
    <div>
    <div className="mobile-only" style={{backgroundColor:"#F4F4F4", paddingTop:140, paddingLeft:20, paddingRight:20}}>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
          return <LearningCard key={item} />;
        })}
      </div>
    </div>
    <div className="computer-only rounded-2xl" style={{backgroundColor:"#F4F4F4", paddingTop:10, paddingLeft:10, paddingRight:10, paddingBottom:10}}>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13].map((item) => {
        return <LearningCard key={item} />;
      })}
    </div>
  </div>
  </div>
  );
};

export default Learning;
