import Assets from "../../assets";



const Opportunitiespopup = () => { 
    return (
        <div>
            <div className="text-center text-black font-bold pt-10 text-lg">OPPORTUNITIES</div>
            <div className="text-center pt-5 text-primary font-bold px-10">Welcome to Boss Up Opportunities</div>
            <div className="px-5 pt-5 pb-20 text-center text-sm">
            <div>A collaborative environment that encourages sharing and discovering opportunities for professional and business growth. Share Distribution, Co-Founders, Affiliate Marketing, Franchises & Licensing, Investment & Grant opportunities others can gain from.</div>
            <div className="flex mt-5 items-center gap-1">
                <Assets.Reporticon width={30}/>
                <div>To sell your products and services, list on "Marketplace".</div>
            </div>
           

            </div>
           
        </div>
    );
};

export default Opportunitiespopup;


