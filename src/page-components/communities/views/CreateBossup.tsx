import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useRouter } from "next/navigation";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import RoutesPath from "../../../constants/Routes";
import CommunitiesController from "../controller/CommunitiesController";
import { Forum } from "../../../common/interfaces/forum";
import { addNewForum, updateForum } from "../../../redux/slices/ForumSlice";
import FilledInputcommunities from "../../../common/components/inputs/FilledInputcommunities";
import FilledTextareacommunities from "../../../common/components/inputs/FilledTextareacommunities";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import { Helmet } from "react-helmet";

interface Props {
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}

const CreateBossup: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.user.profile);
  const profilee = useAppSelector((state) => state.user);
  const forums = useAppSelector((state) => state.forum.forums);
  const titleRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [stateProps, setStateProps] = useState<Forum | null>(null);
  const dispatch = useAppDispatch();
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const boostPostRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const removeImage = (name: string) => {
    const newImageSet = images.filter((ft) => ft.name !== name);
    setImages(newImageSet);
  };

  const createPost = async () => {
    if (loading) return;
    if (
      !CommunitiesController.validatePostField({
        description: descriptionRef.current?.value.trim() ?? "",
        title: titleRef.current?.value.trim() ?? "",
        industryId: industryId!,
        timestamp: Date.now(),
      })
    )
      return;
    setLoading(true);
    if (images.length) {
      const fileUrls = await CommunitiesController.uploadFiles(images);
      if (fileUrls) {
        const response = await CommunitiesController.createBossup({
          timestamp: Date.now(),
          description: descriptionRef.current?.value.trim()!,
          industryId: industryId!,
          title: titleRef.current?.value.trim()!,
          images: fileUrls,
        });
        if (response.success) {
          dispatch(
            addNewForum({
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
            router.push(RoutesPath.promotePost);
          } else {
            router.back();
          }
        }
      }
    } else {
      const response = await CommunitiesController.createBossup({
        timestamp: Date.now(),
        description: descriptionRef.current?.value.trim()!,
        industryId: industryId!,
        title: titleRef.current?.value.trim()!,
      });
      if (response.success) {
        dispatch(
          addNewForum({
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
          router.push(RoutesPath.promotePost);
        } else {
          router.back();
        }
      }
    }
  };

  const updatePostFn = async () => {
    if (
      !CommunitiesController.validatePostField({
        description: descriptionRef.current?.value.trim() ?? "",
        industryId: stateProps?.industryId!,
        title: titleRef.current?.value.trim() ?? "",
      })
    )
      return;
    setLoading(true);

    const response = await CommunitiesController.updateBossup(
      stateProps!.forumId,
      {
        description: descriptionRef.current?.value.trim()!,
        title: titleRef.current?.value.trim()!,
      }
    );
    if (response.success) {
      const postIndex = forums.findIndex(
        (fd) => fd.forumId === stateProps?.forumId
      );
      if (postIndex !== -1) {
        dispatch(
          updateForum({
            index: postIndex,
            forum: {
              ...forums[postIndex],
              description: descriptionRef.current?.value.trim()!,

              title: titleRef.current?.value.trim() ?? "",
            },
          })
        );
      }
      router.push("/communities");
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!!state?.post) {
      setStateProps(state.post);
    }

    if (state?.industryId) {
      setIndustryId(state.industryId);
    }
  }, []);

  return (
    <div className="">
        <Helmet>
                <title>Enter Bossup Challenge - Business Bosses</title>
            </Helmet>
      <div className="mobile-only">
        <div className="mobile-only top-0 w-full z-50 bg-white" style={{ position: 'sticky', top: 0, zIndex: 100, }}>
          <div className="bg-white flex items-center px-4 pt-5 justify-between">
            <h1 className="text-lg font-[900] pb-3">Introduce Your Business</h1>
            <button
              onClick={() => {
                router.back();
              }}
            >
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
            <FilledInputcommunities
              defaultValue={stateProps?.title}
              inputRef={titleRef}
              onchange={() => { }}
              placeholder="Enter Business name"
              className="text-sm "
            />
            <FilledTextareacommunities
              defaultValue={stateProps?.description}
              inputRef={descriptionRef}
              onchange={() => { }}
              placeholder="Describe your business"
              className="text-sm"
            />

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
              text={loading ? "Posting..." : stateProps ? "Update" : "Post"}
              className="w-full p-3"
            />
            <div className="my-10"></div>

          </form>
        </div>
      </div>





      <div className='computer-only'>
        <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile} />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profilee.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
            <div className="">
              <div className="bg-white" style={{ height: "100vh" }}>
                <div
                  className="bg-white top-0 w-full z-50 "
                  style={{


                  }}
                >
                  <div className=" bg-white">
                    <div className="computer-only bg-white pb-5 pt-5 px-4">
                      <div className="flex items-center ">
                        <div className="flex items-center">
                          <button onClick={() => router.back()} className="flex items-center mr-5">
                            <Assets.Backbutton />
                          </button>
                          <div className="text-center">
                            <p className="text-xl font-bold">{"Introduce Your Business"}</p>
                          </div>
                        </div>
                      </div>

                      <div className=" py-5">
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
                          <FilledInputcommunities
                            defaultValue={stateProps?.title}
                            inputRef={titleRef}
                            onchange={() => { }}
                            placeholder="Enter Business name"
                            className="text-sm "
                          />
                          <FilledTextareacommunities
                            defaultValue={stateProps?.description}
                            inputRef={descriptionRef}
                            onchange={() => { }}
                            placeholder="Describe your business"
                            className="text-sm"
                          />

                          <div className="flex items-center justify-between bg-[#f1f1f1] p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Assets.File />
                              <small className="text-[#BABABA]">Add attachment</small>
                            </div>
                            <label
                              htmlFor="file"
                              className="bg-white p-2.5 rounded-full cursor-pointer"
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
                            text={loading ? "Posting..." : stateProps ? "Update" : "Post"}
                            className="w-full p-3"
                          />
                          <div className="my-10"></div>

                        </form>
                      </div>




                    </div>
                  </div>
                </div>







              </div>
            </div>






          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profilee.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profilee.bossup!} partnerData={partnerData} partnerDatatile={partnerDatatile} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CreateBossup;
