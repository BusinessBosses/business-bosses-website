import React, { LegacyRef } from "react";
import Popup from "reactjs-popup";
import AppConstants from "../../../../constants/consts";
import { AiOutlineClose } from "react-icons/ai";
import Assets from "../../../../assets";
import { MdCancel } from "react-icons/md";
import { Industry } from "../../../../common/interfaces/industry";
import { Forum } from "../../../../common/interfaces/forum";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import FilledInput from "../../../../common/components/inputs/FilledInputcommunities";
import FilledTextareacommunities from "../../../../common/components/inputs/FilledTextareacommunities";
interface Props {
  openModal: boolean;
  industry: Industry;
  closeModal: VoidFunction;
  updatePostFn: VoidFunction;
  createPost: VoidFunction;
  stateProps?: Forum;
  titleRef: LegacyRef<HTMLInputElement>;
  descriptionRef: LegacyRef<HTMLTextAreaElement>;
  images: File[];
  removeImage: Function;
  processing: boolean;
  setImages: Function;
}
const FormModal = ({
  closeModal,
  createPost,
  descriptionRef,
  images,
  industry,
  openModal,
  processing,
  removeImage,
  stateProps,
  titleRef,
  updatePostFn,
  setImages,
}: Props) => {
  return (
    <Popup
      lockScroll
      modal
      open={openModal}
      overlayStyle={{
        background: "rgba(0,0,0,.4)",
      }}
    >
      <div className=" md:h-[90vh] h-full bg-[#f4f4f4] overflow-y-auto w-screen md:w-[70vh] shadow-2xl  md:rounded-xl ">
        <div className=" top-0 w-full z-50">
          <div className="bg-white flex items-center p-5 justify-between">
            <h1 className="text-lg font-[900]">
              {industry?.categoryId === AppConstants.LEARNINGID
                ? "Start a Topic"
                : "Share Opportunities"}
            </h1>
            <button onClick={closeModal}>
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>
        <div className=" px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (stateProps) {
                updatePostFn();
              } else {
                createPost();
              }
            }}
          >
            <div className="mobile-only">
            <FilledInput
              defaultValue={stateProps?.title}
              inputRef={titleRef}
              onchange={() => { }}
              placeholder={
                industry?.categoryId === AppConstants.LEARNINGID
                  ? "Enter Topic Title"
                  : "Enter Opportunity Title"
              }
              className="text-sm"
            />
            </div>
           
            <div className="computer-only">
              <div className="my-5 xl:block lg:block md:block sm:hidden xs:hidden">
                <div className="bg-[#fff] rounded-lg p-5 flex items-center gap-2">
                  <input
                    className={`border-none text-[#232324CC] outline-none w-full bg-transparent text-sm`}
                   
                    ref={titleRef}
                    placeholder={
                      industry?.categoryId === AppConstants.LEARNINGID
                        ? "Enter Topic Title"
                        : "Enter Opportunity Title"
                    }
                    onChange={() => { }}
                  />
                 
                    
                </div>
              </div>
            </div>
            <div className="mobile-only">
            <FilledTextareacommunities
              defaultValue={stateProps?.description}
              inputRef={descriptionRef}
              onchange={() => { }}
              placeholder={
                industry?.categoryId === AppConstants.LEARNINGID
                  ? "Enter your Description"
                  : "Describe the Opportunity"
              }
              className="text-sm"
            />
            </div>
           <div className="computer-only my-5 ">
              <textarea
                ref={descriptionRef}
                className={`border-none bg-[#fff] text-[#232324CC] outline-none w-full p-3 rounded-lg resize-none text-sm`}
                placeholder={
                  industry?.categoryId === AppConstants.LEARNINGID
                    ? "Enter your Description"
                    : "Describe the Opportunity"
                }
                defaultValue={stateProps?.description}
                onChange={()=> {}}
                name=""
                id=""
                rows={5}
              ></textarea>
            </div>
            

            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Assets.File />
                <small className="text-[#BABABA]">Add attachment</small>
              </div>
              <label
                htmlFor="file"
                className="bg-[#F4F4F4] p-2.5 rounded-full cursor-pointer"
              >
                <img src={Assets.Gallery} alt="" />
              </label>
            </div>
            <input
              type="file"
              className="w-0 h-0"
              accept="images/*"
              onChange={(e) => {
                if (!e.target.files?.length) return;
                if (images.length === 4) return;
                setImages([...images, e.target.files[0]]);
              }}
              name=""
              id="file"
            />
            {stateProps ? (
              <div className="grid grid-cols-4 gap-4 mb-10">
                {stateProps.images?.map((img: string, index: number) => {
                  return (
                    <div key={index} className="relative">
                      <img
                        alt=""
                        className="h-16 rounded-lg object-cover w-full"
                        src={img}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 mb-10">
                {images.map((img: File, index: number) => {
                  return (
                    <div key={index} className="relative">
                      <img
                        alt=""
                        className="h-16 rounded-lg object-cover w-full"
                        src={URL.createObjectURL(img)}
                      />
                      <div className="absolute top-0 right-0">
                        <button onClick={() => removeImage(img.name)}>
                          <MdCancel color="red" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* <div className="flex items-center justify-between my-10">
            <img src={Assets.Rocket} alt="" />
            <p className="text-[#373737] font-semibold">Boost Post</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                ref={boostPostRef}
                type="checkbox"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div> */}

            <FilledButton
              onClick={stateProps ? updatePostFn : createPost}
              text={processing ? "Posting..." : stateProps ? "Update" : "Post"}
              className="w-full p-3"
            />
            <div className="my-10"></div>

            <div className=" text-center text-sm">
              {industry?.categoryId === AppConstants.LEARNINGID
                ? "Only post articles, insights, and resources others can learn from."
                : "Only post opportunities that will help you and others grow their businesses."}{" "}
            </div>
            <div className="flex items-center gap-1 lg:text-base md:text-sm justify-center text-sm">
              <Assets.Reporticon width={20} />
              <div>
                To sell your products and services, list on "Marketplace".
              </div>
            </div>
          </form>
        </div>
      </div>
    </Popup>
  );
};

export default FormModal;
