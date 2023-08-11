import { useEffect, useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import {
  AiFillMinusCircle,
  AiOutlineCamera,
  AiOutlineClose,
} from "react-icons/ai";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledSelect from "../../../common/components/inputs/FilledSelect";
import { CountryDropdown } from "react-country-region-selector";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import { IoIosArrowForward } from "react-icons/io";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { BsFillPlusCircleFill } from "react-icons/bs";
import serviceApi from "../../../services/serviceApi";
import Popup from "reactjs-popup";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { User } from "../../../common/interfaces/user";
import { saveUserData } from "../../../redux/slices/UserSlice";
import ProfileController from "../controller/ProfileController";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const EditProfilePage = () => {
  const location = useLocation();
  const [expansionState, setExpansionState] = useState({
    additionalInfo: false,
    achievments: false,
    products: false,
  });
  const profile = useAppSelector((state) => state.user.profile);
  const [image, setImage] = useState<File | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    category: boolean;
    industry: boolean;
  }>({ category: false, industry: false });
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [accomplishments, setAccomplishments] = useState<string[]>([]);

  const [products, setProducts] = useState<string[]>([]);
  const loadCategories = async () => {
    const response = await serviceApi.fetch("/profession/all");
    setLoading(true);
    if (response.success) {
      setCategories(response.data.rows.map((mp: any) => mp.title));
    }
    setLoading(false);
  };

  const loadInustries = async () => {
    const response = await serviceApi.fetch("/industry/get");

    setLoading(true);
    if (response.success) {
      setIndustries(response.data.rows.map((mp: any) => mp.industry));
    }
    setLoading(false);
  };

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLSelectElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const twitterRef = useRef<HTMLInputElement>(null);
  const accomplishmentRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const updateProfile = async () => {
    const validator = ProfileController.validateProfileUpdate({
      ...profile,
      username: usernameRef.current!.value.trim(),
      email: emailRef.current!.value.trim(),
      bio: bioRef.current!.value.trim(),
    } as User);
    if (validator !== null) {
      toast.error(validator);
      return;
    }
    if (updating) return;
    setUpdating(true);
    if (image) {
      const imageResponse = await serviceApi.uploadFile(image);
      if (imageResponse) {
        const newUserData: User = {
          ...profile,
          username: usernameRef.current!.value.trim(),
          email: emailRef.current!.value.trim(),
          ageRange: ageRef.current?.value.trim(),
          gender: genderRef.current?.value.trim(),
          bio: bioRef.current!.value.trim(),
          companyName: companyRef.current?.value.trim(),
          website: websiteRef.current?.value.trim(),
          instagram: instagramRef.current?.value.trim(),
          twitter: twitterRef.current?.value.trim(),
          achievements: accomplishments,
          productsandservices: products,
          category: category,
          industry: industry,
          photoUrl: imageResponse.fileUrl,
        } as User;
        const response = await ProfileController.updateProfile(newUserData);
        if (response.success) {
          toast.success(response.message);
          dispatch(saveUserData(newUserData));
        }
      }
    } else {
      const newUserData: User = {
        ...profile,
        username: usernameRef.current!.value.trim(),
        email: emailRef.current!.value.trim(),
        ageRange: ageRef.current?.value.trim(),
        gender: genderRef.current?.value.trim(),
        bio: bioRef.current!.value.trim(),
        companyName: companyRef.current?.value.trim(),
        website: websiteRef.current?.value.trim(),
        instagram: instagramRef.current?.value.trim(),
        twitter: twitterRef.current?.value.trim(),
        achievements: accomplishments,
        productsandservices: products,
        category: category,
        industry: industry,
      } as User;
      const response = await ProfileController.updateProfile(newUserData);
      if (response.success) {
        toast.success(response.message);
        dispatch(saveUserData(newUserData));
      }
    }
    setUpdating(false);
  };

  useEffect(() => {
    const state = location.state;
    if (state && !profile) {
      dispatch(saveUserData(state));
    }
    setAccomplishments(profile?.achievements ?? []);
    setProducts(profile?.productsandservices ?? []);
    ageRef.current!.value = profile?.ageRange ?? "";
    genderRef.current!.value = profile?.gender ?? "";
  }, [profile]);

  return (
    <div className=" min-h-screen h-full bg-white">
      <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, }}>

        <CommonPageHeader title="Edit Profile" />
      </div>
      <div className="w-full h-3 bg-[#f4f4f4]"></div>
      <Popup lockScroll modal open={modalState.category || modalState.industry}>
        <div className=" min-h-screen bg-white  mb-20 min-w-full w-screen p-5">
          <div className="overflow-y-scroll">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium">
                {modalState.category ? "Profession" : "Industries"}
              </h3>
              <button
                onClick={() => {
                  setModalState({ category: false, industry: false });
                }}
              >
                <MdCancel />
              </button>
            </div>
            {loading ? (
              <FetchStatus
                error={false}
                errorMessage=""
                loading
                onReload={() => { }}
              />
            ) : null}
            <ul className="mt-10 flex flex-col">
              {modalState.category
                ? categories.map((cat: string, index: number) => {
                  return (
                    <li
                      className="outline-none border-none my-5"
                      key={index}
                      onClick={() => {
                        setCategory(cat);
                        setModalState({ category: false, industry: false });
                      }}
                    >
                      {cat}
                    </li>
                  );
                })
                : industries.map((cat: string, index: number) => {
                  return (
                    <li
                      className="outline-none border-none my-5"
                      key={index}
                      onClick={() => {
                        setIndustry(cat);
                        setModalState({ category: false, industry: false });
                      }}
                    >
                      {cat}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </Popup>
      <div className="py-5 ">
        <div className="flex items-center justify-center ">
          {profile?.photoUrl || image ? (
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full"
                src={image ? URL.createObjectURL(image) : profile!.photoUrl}
                alt=""
              />
              <label
                htmlFor="avatar"
                className="bg-primary absolute bottom-1 right-1 p-1 rounded-full text-white"
              >
                <AiOutlineCamera />
              </label>
            </div>
          ) : (
            <div className="bg-[#F4F4F4] rounded-full relative">
              <img
                src={Assets.NoProfile}
                loading="lazy"
                className={` "h-20 w-20"} rounded-full object-cover `}
                alt=""
                style={{ width: "120px", height: "120px" }}
              />

              <label
                htmlFor="avatar"
                className="bg-primary absolute bottom-1 right-1 p-1 rounded-full text-white"
              >
                <AiOutlineCamera />
              </label>
            </div>
          )}
        </div>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files?.length) {
              setImage(e.target.files[0]);
            }
          }}
          name=""
          className="w-0 h-0"
          id="avatar"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="px-4">
            <FilledInput
              defaultValue={profile?.username}
              inputRef={usernameRef}
              onchange={() => { }}
              label="Username"
            />
            <FilledInput
              defaultValue={profile?.email}
              inputRef={emailRef}
              onchange={() => { }}
              label="Email"
            />
            <FilledSelect
              defaultValue={profile?.ageRange}
              inputRef={ageRef}
              data={["10 - 15", "18 - 30", "24 - 56"]}
              onchange={() => { }}
              label="Age Range"
            />
            <FilledSelect
              defaultValue={profile?.gender}
              inputRef={genderRef}
              data={["Male", "Female"]}
              onchange={() => { }}
              label="Gender"
            />
            <div className="my-5">
              <label className="text-[#333333] text-sm font-[700] ">
                Location
              </label>
              <CountryDropdown
                classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
                value={country ?? profile?.location ?? ""}
                onChange={(val) => {
                  setCountry(val);
                }}
              />
            </div>
            <FilledTextarea
              defaultValue={profile?.bio}
              inputRef={bioRef}
              onchange={() => { }}
              label="Bio"
            />
            <div className="my-5">
              <label className="text-[#333333] text-sm font-[700]">Title</label>
              <div
                onClick={() => {
                  loadCategories();
                  setModalState({ category: true, industry: false });
                }}
                className="flex items-center justify-between rounded-lg bg-[#f4f4f4] p-3"
              >
                <p>{category ?? profile?.category}</p>
                <IoIosArrowForward />
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              setExpansionState({
                ...expansionState,
                additionalInfo: !expansionState.additionalInfo,
              })
            }
            className="m bg-[#f4f4f4] p-3 flex items-center justify-between"
          >
            <p>Additional Information (Optional)</p>
            {!expansionState.additionalInfo ? (
              <BsFillPlusCircleFill />
            ) : (
              <AiFillMinusCircle />
            )}
          </div>
          <div
            className={`${expansionState.additionalInfo ? "block" : "hidden"
              } px-4`}
          >
            <FilledInput
              defaultValue={profile?.companyName}
              inputRef={companyRef}
              onchange={() => { }}
              label="Company Name"
            />
            <div className="my-5">
              <label className="text-[#333333] text-sm font-[700]">
                Industry
              </label>
              <div
                onClick={() => {
                  loadInustries();
                  setModalState({ category: false, industry: true });
                }}
                className="flex items-center justify-between bg-[#f4f4f4] p-3"
              >
                <p>{industry ?? profile?.industry}</p>
                <IoIosArrowForward />
              </div>
            </div>
            <FilledInput
              defaultValue={profile?.website}
              inputRef={websiteRef}
              onchange={() => { }}
              label="Website"
            />
            <FilledInput
              defaultValue={profile?.instagram}
              inputRef={instagramRef}
              onchange={() => { }}
              label="Instagram"
            />
            <FilledInput
              defaultValue={profile?.twitter}
              inputRef={twitterRef}
              onchange={() => { }}
              label="Twitter"
            />
          </div>

          <div className="my-">
            <div
              onClick={() =>
                setExpansionState({
                  ...expansionState,
                  achievments: !expansionState.achievments,
                })
              }
              className="my- bg-[#f4f4f4] p-3 flex items-center justify-between"
            >
              <h3 className=" font-bold">Achievements</h3>
              {!expansionState.achievments ? (
                <BsFillPlusCircleFill />
              ) : (
                <AiFillMinusCircle />
              )}
            </div>
            <div
              className={`${expansionState.achievments ? "block" : "hidden"
                } px-4`}
            >
              <div className="flex items-center justify-between">
                <FilledInput
                  placeholder="Add achievement"
                  onchange={() => { }}
                  inputRef={accomplishmentRef}
                />
                <button
                  onClick={() => {
                    if (!accomplishmentRef.current?.value.trim()) return;
                    setAccomplishments([
                      accomplishmentRef.current.value.trim(),
                      ...accomplishments,
                    ]);
                    accomplishmentRef.current!.value = "";
                  }}
                  className="bg-primary px-6 py-2 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              {accomplishments.map((item: string, index: number) => (
                <div key={index} className="relative my-5">
                  <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                    <img src={Assets.Trophy} alt="" />
                    <p>{item}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newData = accomplishments.filter(
                        (ft) => ft !== item
                      );
                      setAccomplishments(newData);
                    }}
                    className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
                  >
                    <AiOutlineClose size={10} color="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="my-">
            <div
              onClick={() =>
                setExpansionState({
                  ...expansionState,
                  products: !expansionState.products,
                })
              }
              className="my- bg-[#f4f4f4] p-3 flex items-center justify-between"
            >
              <h3 className=" font-bold">Products</h3>
              {!expansionState.products ? (
                <BsFillPlusCircleFill />
              ) : (
                <AiFillMinusCircle />
              )}
            </div>
            <div
              className={`${expansionState.products ? "block" : "hidden"} px-4`}
            >
              <div className="flex items-center justify-between">
                <FilledInput
                  placeholder="Add Product"
                  onchange={() => { }}
                  inputRef={productRef}
                />
                <button
                  onClick={() => {
                    if (!productRef.current?.value.trim()) return;
                    setProducts([productRef.current.value.trim(), ...products]);
                    productRef.current!.value = "";
                  }}
                  className="bg-primary px-6 py-2 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
              {products.map((item: string, index: number) => (
                <div key={index} className="relative my-5">
                  <div className="flex items-center gap-3  bg-[rgba(0,0,0,.1)] p-2 rounded-lg">
                    <img src={Assets.Product} alt="" />
                    <p>{item}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newData = products.filter((ft) => ft !== item);
                      setProducts(newData);
                    }}
                    className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"
                  >
                    <AiOutlineClose size={10} color="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mt-20 mb-10">
            <FilledButton
              onClick={updateProfile}
              text={updating ? "Updating Profile..." : "Save"}
              className="w-full p-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
