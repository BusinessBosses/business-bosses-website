import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import { CountryDropdown } from "react-country-region-selector";
import Assets from "../../../assets";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import FilledButton from "../../../common/components/buttons/FilledButton";

const CreateListing = () => {
  const navigate = useNavigate();
  return (
    <div className=" min-h-screen h-full">
      <div className="fixed top-0 w-full z-50">
        <div className="bg-white flex items-center p-5 justify-between">
          <h1 className="text-xl font-[500]">Create Listing</h1>
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            <AiOutlineClose />
          </button>
        </div>
      </div>
      <div className="mt-20 px-5">
        <form>
          <FilledInput
            onchange={() => {}}
            placeholder="Enter Price"
            className="text-sm"
          />
          <FilledTextarea
            onchange={() => {}}
            placeholder="Describe your listing"
            className="text-sm"
          />
          <FilledInput
            onchange={() => {}}
            placeholder="Select Category"
            className="text-sm "
          />
          <div className="my-10">
            <CountryDropdown
              defaultOptionLabel="Select Location"
              classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
              value=""
              onChange={(val) => {}}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Assets.File />
              <small className="text-[#BABABA]">Add attachment</small>
            </div>
            <button>
              <Assets.Upload />
            </button>
          </div>
          <div className="flex items-center justify-between my-10">
            <img src={Assets.Rocket} alt="" />
            <p className="text-[#373737] font-semibold">Boost Post</p>
            <MdOutlineKeyboardArrowRight size={24} className="text-primary" />
          </div>

          <FilledButton onClick={() => {}} text="Post" className="w-full p-3" />
          <div className="my-10"></div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
