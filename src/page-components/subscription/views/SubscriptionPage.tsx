import React, { useRef, useState } from "react";
import SubscriptionController, {
  PaymentIntentStruct,
} from "../controller/SubscriptionController";
import { useAppSelector } from "../../../redux/store/store";
import { useRouter } from "next/navigation";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import { CheckCircle2, Star, Sparkles, MapPin, Map, Lock, Users, Zap } from "lucide-react";

interface Props {
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}

const SubscriptionPage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = Annually (Pro Yearly), 1 = Monthly
  const [processing, setProcessing] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.user);
  const router = useRouter();

  const prices: PaymentIntentStruct[] = [
    {
      plan: "annually",
      price: "price_1NfNnDEGsMsi6baUkDiWNJr7", // Update with actual stripe price ID if needed
    },
    {
      plan: "monthly",
      price: "price_1NfNnDEGsMsi6baU9FbZf8dQ", // Update with actual stripe price ID if needed
    }
  ];

  const createSubscriptionIntent = async () => {
    if (processing) return;
    setProcessing(true);
    try {
      const intentData = prices[selectedIndex];
      const res = await SubscriptionController.createSubscriptionIntent(intentData);
      // Integration with stripe would follow here using res.data
      console.log('Subscription intent created', res);
    } catch (error) {
      console.error('Subscription error', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8 px-4 pb-24 lg:pb-8">
       {/* Header Card */}
       <div className="bg-[#8E44AD] rounded-t-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-2xl font-bold mb-2">Upgrade to a Pro Boss Experience</h1>
          <p className="text-white/80 text-sm">Everything you need to boost and grow your business 10X faster, all in one place.</p>
       </div>

       <div className="bg-white p-6 shadow-lg rounded-b-2xl border border-slate-200 border-t-0">
          
          {/* 8 Core Perks */}
          <div className="space-y-4 mb-8">
             <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-2">What's included:</h2>
             
             <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
               <div className="flex items-center space-x-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                 <span>Premium Gold Pro Badge</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Zap className="w-5 h-5 text-[#8E44AD] shrink-0" />
                 <span>Earn 100 bonus coins per month</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Sparkles className="w-5 h-5 text-[#E67E22] shrink-0" />
                 <span>Boost posts FREE with coins</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Users className="w-5 h-5 text-blue-500 shrink-0" />
                 <span>More connections & verified business referrals</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Star className="w-5 h-5 text-yellow-500 shrink-0" />
                 <span>Featured marketplace listing placements</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Lock className="w-5 h-5 text-slate-600 shrink-0" />
                 <span>Exclusive partner discounts & academy perks</span>
               </div>
               <div className="flex items-center space-x-3">
                 <Map className="w-5 h-5 text-teal-500 shrink-0" />
                 <span>Grow business with automated marketing campaigns</span>
               </div>
               <div className="flex items-center space-x-3">
                 <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                 <span>Find more verified leads & business matches</span>
               </div>
             </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3 mb-6">
             {/* Pro Yearly */}
             <div 
               onClick={() => setSelectedIndex(0)}
               className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedIndex === 0 ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
             >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedIndex === 0 ? 'border-red-500' : 'border-slate-300'}`}>
                        {selectedIndex === 0 && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                     </div>
                     <div>
                       <div className="font-bold text-slate-900">Pro Yearly</div>
                       <div className="text-xs font-semibold text-slate-500">Best Value · Save 33%</div>
                       <div className="mt-1 flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold w-max">
                         <span>🎁 2 months free included</span>
                       </div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">$9.99/mo</div>
                    <div className="text-xs text-slate-500">($119.88/year)</div>
                  </div>
                </div>
             </div>

             {/* Pro Monthly */}
             <div 
               onClick={() => setSelectedIndex(1)}
               className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedIndex === 1 ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
             >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedIndex === 1 ? 'border-red-500' : 'border-slate-300'}`}>
                        {selectedIndex === 1 && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                     </div>
                     <div>
                       <div className="font-bold text-slate-900">Pro Monthly</div>
                       <div className="text-xs font-semibold text-slate-500">Cancel anytime</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">$14.99/mo</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Action Button */}
          <button 
             onClick={createSubscriptionIntent}
             disabled={processing}
             className="w-full py-4 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center disabled:opacity-70 bg-[#8E44AD] hover:bg-[#6C3483]"
          >
             {processing ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
               <span>{selectedIndex === 0 ? 'Subscribe to Pro Yearly (Get 2 Months Free)' : 'Subscribe to Pro Monthly'}</span>
             )}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-4">
             Secure payment powered by Stripe. Cancel anytime.
          </p>
       </div>
    </div>
  );
};
export default SubscriptionPage;
