import Assets from "../../assets";



const Learningpopup = () => { 
    return (
        <div>
            <div className="text-center text-black font-bold pt-10 text-lg">LEARNING</div>
            <div className="text-center pt-10 text-primary font-bold px-10">Welcome to Boss Up Learning</div>
            <div className="px-5 pt-5 pb-20 text-center">
            <div>A collaborative environment that encourages learning and professional development. Start a Topic, post articles, insights, and resources others can learn from.</div>
            <div className="flex mt-5 items-center gap-3">
                <Assets.Reporticon width={20}/>
                <div>To sell your products and services, list on "Marketplace".</div>
            </div>
           

            </div>
           
        </div>
    );
};

export default Learningpopup;


