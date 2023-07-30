import React, { useEffect, useRef, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import Assets from "../../../assets";
import { MdCancel, MdOutlineKeyboardArrowRight } from "react-icons/md";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { useLocation, useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import CreatePostController from "../controller/CreatePostController";
import { addNewPost, updatePost } from "../../../redux/slices/PostSlice";
import { Post } from "../../../common/interfaces/post";

const CreatePost = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.mixedPosts);
  const location = useLocation();
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stateProps, setStateProps] = useState<Post | null>(null);
  const boostPostRef = useRef<HTMLInputElement>(null);
  const postTitleRef = useRef<HTMLTextAreaElement>(null);
  const removeImage = (name: string) => {
    const newImageSet = images.filter((ft) => ft.name !== name);
    setImages(newImageSet);
  };

  const createPost = async () => {
    if (loading) return;
    if (
      !CreatePostController.validatePostField({
        title: postTitleRef.current?.value.trim() ?? "",
        images: images.map((mp) => mp.name),
        timestamp: Date.now(),
      })
    )
      return;
    setLoading(true);
    if (images.length) {
      const fileUrls = await CreatePostController.uploadFiles(images);
      if (fileUrls) {
        const response = await CreatePostController.createPost({
          timestamp: Date.now(),
          title: postTitleRef.current?.value.trim()!,
          images: fileUrls,
        });
        if (response.success) {
          dispatch(
            addNewPost({
              isForum: false,
              data: {
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
              } as Post,
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
      const response = await CreatePostController.createPost({
        timestamp: Date.now(),
        title: postTitleRef.current?.value.trim()!,
      });
      if (response.success) {
        dispatch(
          addNewPost({
            isForum: false,
            data: {
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
            } as Post,
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

  function isPost(obj: any): obj is Post {
    return "postId" in obj;
  }
  const updatePostFn = async () => {
    if (
      !CreatePostController.validatePostField({
        title: postTitleRef.current?.value.trim() ?? "",
        images: stateProps?.images,
        timestamp: Date.now(),
      })
    )
      return;
    setLoading(true);

    const response = await CreatePostController.updatePost(
      stateProps!.postId,
      postTitleRef.current!.value.trim()
    );
    if (response.success) {
      const postIndex = posts.findIndex(
        (fd) => isPost(fd.data) && fd.data.postId === stateProps?.postId
      );
      if (postIndex !== -1) {
        dispatch(
          updatePost({
            index: postIndex,
            post: {
              ...posts[postIndex],
              data: {
                ...posts[postIndex].data,
                title: postTitleRef.current?.value.trim(),
              } as Post,
            },
          })
        );
      }
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
    <div>
      <div className="">
        <div className="bg-white top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 999, borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)' }}>
        <div className="mobile-only px-4">
            <CommonPageHeader title="Create Post" /></div>
          
        </div>

        <div className="px-4 mt-5">
          <div className="flex items-center gap-3">
            <UserAvatar
              imageURL={
                profile?.photoUrl ??
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
            />
            <p className="text-[#333333] text-lg font-medium">
              {profile?.username}
            </p>
          </div>

          <div className=" mt-5">
            <textarea
              ref={postTitleRef}
              name=""
              id=""
              defaultValue={stateProps?.title}
              placeholder="What’s on your mind?"
              className="w-full outline-none border-[1px] border-[#EAEAEA] placeholder:text-[#A9A9A9] rounded-lg p-3 text-sm resize-none bg-[#F4F4F4]"
              rows={8}
            ></textarea>

            {stateProps ? null : (
              <div className="flex mt-4 items-center gap-3">
                <p className="text-[#333333]">Add Image</p>
                <label htmlFor="file" className="bg-[#F4F4F4] p-2.5 rounded-full cursor-pointer">
                  <img src={Assets.Gallery} alt="" />
                </label>
                <input
                  type="file"
                  className="w-0 h-0 absolute top-0 left-0 opacity-0 cursor-pointer"
                  accept="images/*"
                  onChange={(e) => {
                    if (!e.target.files?.length) return;
                    if (images.length === 4) return;
                    setImages([...images, e.target.files[0]]);
                  }}
                  name=""
                  id="file"
                />
              </div>
            )}

            {stateProps ? (
              <div className="grid grid-cols-4 gap-4 mb-10">
                {stateProps.images?.map((img: string, index: number) => {
                  return (
                    <div key={index} className="relative">
                      <img
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
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                <img src={Assets.Rocket} alt="" />
                <div className="flex flex-col">
                  <p className="text-[#373737] font-semibold">Boost this Post</p>
                  <p className="text-[#555555] text-xs mt-1">Reach wider audience and get more views.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  ref={boostPostRef}
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              {/* <MdOutlineKeyboardArrowRight size={24} className="text-primary" /> */}
            </div>

            <div className="mt-10">
              <FilledButton
                onClick={stateProps ? updatePostFn : createPost}
                text={loading ? "Posting..." : stateProps ? "Update" : "Post"}
                className="w-full py-3"
              />
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default CreatePost;
