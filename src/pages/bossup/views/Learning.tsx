import LearningCard from "./components/LearningCard";

const Learning = () => {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
          return <LearningCard key={item} />;
        })}
      </div>
    </div>
  );
};

export default Learning;
