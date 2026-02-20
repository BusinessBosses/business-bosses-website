import { CountryDropdown } from "react-country-region-selector";
import FilledSelect from "../../common/components/inputs/FilledSelect";
import { useRef, useState } from "react";
import { Market } from "../../common/interfaces/Market";
import FilledButtonsmall from "../../common/components/buttons/FilledButtonsmall";
import FilledButton from "../../common/components/buttons/FilledButton";
import Assets from "../../assets";

const Marketplacesearchpopup = ({ onClosePopup }: { onClosePopup: () => void }) => {
    const [stateProps, setStateProps] = useState<Market | null>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const [country, setCountry] = useState<string | null>(null);
    return (
        <div className="px-5">
            <div className="flex items-center pt-10">
                <button onClick={() => onClosePopup()}>
                    <Assets.Backbutton />
                </button>
                <div className="text-black font-bold pl-10 text-lg">Filter</div>

            </div>

            <FilledSelect
                defaultValue={stateProps?.category}
                inputRef={categoryRef}
                data={[
                    "Select Category",
                    "Home, Garden & Outdoors",
                    "Fashion & Beauty",
                    "Sports & Entertainment",
                    "Books & Education",
                    "Jewellery & Timepieces",
                    "Security, Safety & Equipment",
                    "Video Games & Electronics",
                    "Agriculture, Food, Beverage",
                    "Construction & Real Estate",
                    "Vehicle & Transportation",
                    "Business Services & Events",
                    "Other",
                ]}
                onchange={(e) => { }}
            />

            <div className="my-10">
                <CountryDropdown
                    defaultOptionLabel="Select Location"
                    classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
                    value={country ?? stateProps?.location ?? ""}
                    onChange={(val) => {
                        setCountry(val);
                    }}
                />
            </div>

            <div className="flex items-center gap-5 pb-5 justify-end">
                <div className="text-primary">Reset</div>
                <div className="">
                    <FilledButtonsmall onClick={() => { }} text={"Search"} />

                </div>

            </div>



        </div>
    );
};

export default Marketplacesearchpopup;


