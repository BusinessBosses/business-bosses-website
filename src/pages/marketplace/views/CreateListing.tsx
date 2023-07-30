import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import { CountryDropdown } from "react-country-region-selector";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import FilledSelect from "../../../common/components/inputs/FilledSelect";
import { MdCancel } from "react-icons/md";
import { Market } from "../../../common/interfaces/Market";
import MarketController from "../controller/MarketController";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import {
  addNewListing,
  updateListing,
} from "../../../redux/slices/MarketSlice";
import RoutesPath from "../../../constants/Routes";

const CreateListing = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const markets = useAppSelector((state) => state.market.markets);
  const priceRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [stateProps, setStateProps] = useState<Market | null>(null);
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<File[]>([]);
  const boostPostRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const removeImage = (name: string) => {
    const newImageSet = images.filter((ft) => ft.name !== name);
    setImages(newImageSet);
  };

  const createPost = async () => {
    if (loading) return;
    if (
      !MarketController.validatePostField({
        description: descriptionRef.current?.value.trim() ?? "",
        images: images.map((mp) => mp.name),
      })
    )
      return;
    setLoading(true);
    if (images.length) {
      const fileUrls = await MarketController.uploadFiles(images);
      if (fileUrls) {
        const response = await MarketController.createListing({
          timestamp: Date.now(),
          description: descriptionRef.current?.value.trim()!,
          images: fileUrls,
          category: categoryRef.current?.value.trim(),
          location: country ?? undefined,
          price: priceRef.current?.value.trim(),
        });
        if (response.success) {
          dispatch(
            addNewListing({
              ...response.data,
              coins: [],
              likes: [],
              comments: [],
              user: {
                username: profile!.username,
                email: profile?.email,
                uid: profile?.uid,
                bio: profile!.bio,
              },
            })
          );
          if (boostPostRef.current?.checked) {
            navigate(RoutesPath.promotePost);
          } else {
            navigate(-1);
          }
        }
      }
    } else {
      const response = await MarketController.createListing({
        timestamp: Date.now(),
        description: descriptionRef.current?.value.trim()!,
        category: categoryRef.current?.value.trim(),
        location: country ?? undefined,
        price: priceRef.current?.value.trim(),
      });
      if (response.success) {
        dispatch(
          addNewListing({
            ...response.data,
            coins: [],
            likes: [],
            comments: [],
            user: {
              username: profile!.username,
              email: profile?.email,
              uid: profile?.uid,
              bio: profile!.bio,
            },
          })
        );
        if (boostPostRef.current?.checked) {
          navigate(RoutesPath.promotePost);
        } else {
          navigate(-1);
        }
      }
    }
  };

  const updatePostFn = async () => {
    if (
      !MarketController.validatePostField({
        description: boostPostRef.current?.value.trim() ?? "",
        images: stateProps?.images,
        timestamp: Date.now(),
      })
    )
      return;
    setLoading(true);

    const response = await MarketController.updateListing(
      stateProps!.marketId,
      {
        description: descriptionRef.current?.value.trim()!,
        category: categoryRef.current?.value.trim(),
        location: country ?? undefined,
        price: priceRef.current?.value.trim(),
      }
    );
    if (response.success) {
      const postIndex = markets.findIndex(
        (fd) => fd.marketId === stateProps?.marketId
      );
      if (postIndex !== -1) {
        dispatch(
          updateListing({
            index: postIndex,
            post: {
              ...markets[postIndex],
              description: descriptionRef.current?.value.trim()!,
              category:
                stateProps?.category ?? categoryRef.current?.value.trim(),
              location: country ?? stateProps?.category ?? undefined,
              price: priceRef.current?.value.trim() ?? "",
            },
          })
        );
      }
      setLoading(false);
      navigate(-1);
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!!state) {
      setStateProps(state);
    }
  }, []);

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
      <div className="mt-20 px-4">
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
          <FilledInput
            defaultValue={stateProps?.price}
            inputRef={priceRef}
            onchange={() => {}}
            placeholder="Enter Price"
            className="text-sm"
          />
          <FilledTextarea
            defaultValue={stateProps?.description}
            inputRef={descriptionRef}
            onchange={() => {}}
            placeholder="Describe your listing"
            className="text-sm"
          />
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
            onchange={(e) => {}}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Assets.File />
              <small className="text-[#BABABA]">Add attachment</small>
            </div>
            <label htmlFor="file">
              <Assets.Upload />
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
                      className="h-16 rounded-lg object-cover w-full"
                      src={img}
                      alt=""
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
          <div className="flex items-center justify-between my-10">
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
          </div>

          <FilledButton
            onClick={stateProps ? updatePostFn : createPost}
            text={loading ? "Posting..." : stateProps ? "Update" : "Post"}
            className="w-full p-3"
          />
          <div className="my-10"></div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
