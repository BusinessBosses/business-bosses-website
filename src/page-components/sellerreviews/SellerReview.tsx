import { useEffect, useRef, useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import FilledButton from "../../common/components/buttons/FilledButton";
import PublicProfileDetailsonly from "../profile/views/components/PublicProfileDetailsonly";
import Rating from "@mui/material/Rating/Rating";
import SellerreviewItem from "./components/SellerreviewItem";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetailswcr";
import { BottomSheet } from "react-spring-bottom-sheet";
import FilledTextarea from "../../common/components/inputs/FilledTextarea";
import FilledButtonsmall from "../../common/components/buttons/FilledButtonsmall";
import Ratingbar from "./components/Ratingbar";
import { User } from "../../common/interfaces/user";
import { useLocation, useRouter } from "next/navigation";
import serviceApi from "../../services/serviceApi";
import FetchStatus from "../../common/components/fetch_status/FetchStatus";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Assets from "../../assets";
import { PartnerData } from "../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../common/interfaces/partnerdatatile";
import { Helmet } from "react-helmet";
interface Review {
  id: number;
  sellerId: string;
  rating: number;
  userId: string;
  reviewText?: string;
  rater: User;
  createdAt: string;
}

interface Props {
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}

const SellerReview: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<boolean>(false);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const router = useRouter();
  const location = useLocation();
  const profile = useAppSelector((state) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);

  const getReviewBasedOfCount = (count: number): number => {
    return reviews?.filter((ft) => ft.rating === count).length ?? 0;
  };

  const getUserReviews = async (userId: string) => {
    setLoading(true);
    const response = await serviceApi.fetch(`/reviews/user/${userId}`);
    if (response.success) {
      const revs = response.data.rows;
      if (!revs.length) {
        setReviews(null);
      } else {
        setReviews(revs);
      }
    }
    setLoading(false);
  };

  const onRate = async () => {
    if (rating) return;
    setRating(true);
    const response = await serviceApi.post("/reviews", {
      sellerId: seller?.uid,
      rating: currentRate,
      reviewText: reviewInputRef.current?.value.trim() ?? "",
    });
    if (response.success) {
      getUserReviews(seller!.uid);
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!!!state) {
      router.back();
      return;
    } else {
      setSeller(state);

      getUserReviews(state.uid);
    }
  }, []);

  return (
    <div>
      <Helmet>
        ( <title>{`${seller?.username}'s Reviews - Business Bosses`}</title> )
      </Helmet>

      <div className="mobile-only">
        <div
          className=" top-0 w-full z-50 mobile-only "
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        >
          <CommonPageHeader title="Seller Reviews" />
        </div>
        {loading ? (
          <FetchStatus
            error={false}
            loading={true}
            errorMessage=""
            onReload={() => {}}
          />
        ) : (
          <div
            className="bg-white"
            style={{
              borderTop: "15px solid rgba(244, 244, 244, 1)",
              height: "100vh",
            }}
          >
            <div className="flex-row justify-center">
              <div className="pt-5">
                {seller ? <PublicProfileDetailsonly data={seller!} /> : null}
              </div>

              <div className="flex justify-center pt-5">
                {(reviews === null ||
                  !!!reviews.filter(
                    (ft) => ft.rater.uid === profile.profile?.uid
                  ).length) &&
                  seller?.uid !== profile.profile?.uid && (
                    <FilledButtonsmall
                      className="py-3 px-8"
                      onClick={() => {
                        setOpen(true);
                      }}
                      text={"Rate Seller"}
                    />
                  )}
              </div>

              <BottomSheet
                scrollLocking={true}
                onDismiss={() => setOpen(false)}
                maxHeight={1000}
                open={open}
                footer={
                  <div className="flex justify-center">
                    <FilledButton
                      onClick={onRate}
                      text={rating ? "Rating" : "Rate"}
                    />
                  </div>
                }
              >
                <div className="h-[50vh] overflow-y-auto">
                  <div className="font-bold  p-5">Rate Seller</div>
                  <div className="bg-[#f4f4f4] mx-5 gap-1 p-5 rounded-xl flex justify-center">
                    {[1, 2, 3, 4, 5].map((mp) => {
                      if (currentRate >= mp) {
                        return (
                          <AiFillStar
                            onClick={() => setCurrentRate(mp)}
                            size={25}
                            color="yellow"
                          />
                        );
                      } else {
                        return (
                          <AiOutlineStar
                            onClick={() => {
                              setCurrentRate(mp);
                            }}
                            size={25}
                          />
                        );
                      }
                    })}
                    {/* <Rating
                      name="half-rating-read"
                      defaultValue={0.0}
                      precision={0.5}
                      readOnly
                      size="large"
                      onChange={(e, newVal) => {
                        console.log(newVal);
                      }}
                    /> */}
                  </div>
                  <div className="px-5">
                    <FilledTextarea
                      placeholder={"Write your Review here"}
                      inputRef={reviewInputRef}
                      onchange={() => {}}
                      label=""
                    />
                  </div>
                </div>
              </BottomSheet>
            </div>

            <div className="rounded-xl bg-[#f4f4f4] flex p-5 m-5 gap-8">
              <div>
                <div className="text-primary font-bold">Rating</div>
                <div className="text-sm font-bold">
                  <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                    {seller?.averageRating?.toFixed(1) ?? 0.0}
                  </span>{" "}
                  out of 5
                </div>
                <div className="text-sm">
                  Based on <span>{reviews?.length ?? 0}</span> reviews
                </div>
                <Rating
                  name="half-rating-read"
                  defaultValue={seller?.averageRating ?? 0}
                  precision={0.5}
                  readOnly
                  size="large"
                />
              </div>

              <div className="text-sm">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flexBasis: "50%" }}>
                    <div>5 stars</div>
                    <div>4 stars</div>
                    <div>3 stars</div>
                    <div>2 stars</div>
                    <div>1 star</div>
                  </div>
                  <div
                    className="space-y-1.5 pt-1.5"
                    style={{ flexBasis: "50%" }}
                  >
                    <Ratingbar
                      progress={
                        reviews === null
                          ? 0
                          : (getReviewBasedOfCount(5) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews === null
                          ? 0
                          : (getReviewBasedOfCount(4) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews === null
                          ? 0
                          : (getReviewBasedOfCount(3) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews === null
                          ? 0
                          : (getReviewBasedOfCount(2) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews === null
                          ? 0
                          : (getReviewBasedOfCount(1) / reviews.length) * 100
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {reviews != null ? (
              reviews!.map((post) => <SellerreviewItem data={post} />)
            ) : (
              <div className="flex justify-center items-center">
                No Review For Seller!
              </div>
            )}
          </div>
        )}
      </div>

      <div className="computer-only bg-[#fff]">
        <ComputerHeader
          partnerData={partnerData}
          partnerDatatile={partnerDatatile}
        />

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
                {seller ? (
                  <ComputerProfileDetails data={profile.profile!} />
                ) : null}
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
            <div className="">
              <div className="computer-only bg-white pb-5 pt-5 px-4">
                <div className="flex items-center ">
                  <div className="flex items-center">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center mr-5"
                    >
                      <Assets.Backbutton />
                    </button>
                    <div className="text-center">
                      {" "}
                      {/* Centered title */}
                      <p className="text-xl font-bold">Seller Review</p>
                    </div>
                  </div>
                </div>
              </div>
              {loading ? (
                <FetchStatus
                  error={false}
                  loading={true}
                  errorMessage=""
                  onReload={() => {}}
                />
              ) : (
                <div
                  className="bg-white"
                  style={{
                    borderTop: "15px solid rgba(244, 244, 244, 1)",
                    height: "100vh",
                  }}
                >
                  <div className="flex-row justify-center">
                    <div className="pt-5">
                      {seller ? (
                        <PublicProfileDetailsonly data={seller!} />
                      ) : null}
                    </div>

                    <div className="flex justify-center pt-5">
                      {(reviews === null ||
                        !!!reviews.filter(
                          (ft) => ft.rater.uid === profile.profile?.uid
                        ).length) &&
                        seller?.uid !== profile.profile?.uid && (
                          <FilledButtonsmall
                            className="py-3 px-8"
                            onClick={() => {
                              setOpen(true);
                            }}
                            text={"Rate Seller"}
                          />
                        )}
                    </div>

                    <BottomSheet
                      scrollLocking={true}
                      onDismiss={() => setOpen(false)}
                      maxHeight={1000}
                      open={open}
                      footer={
                        <div className="flex justify-center">
                          <FilledButton
                            onClick={onRate}
                            text={rating ? "Rating" : "Rate"}
                          />
                        </div>
                      }
                    >
                      <div className="h-[50vh] overflow-y-auto">
                        <div className="font-bold  p-5">Rate Seller</div>
                        <div className="bg-[#f4f4f4] mx-5 gap-1 p-5 rounded-xl flex justify-center">
                          {[1, 2, 3, 4, 5].map((mp) => {
                            if (currentRate >= mp) {
                              return (
                                <AiFillStar
                                  onClick={() => setCurrentRate(mp)}
                                  size={25}
                                  color="yellow"
                                />
                              );
                            } else {
                              return (
                                <AiOutlineStar
                                  onClick={() => {
                                    setCurrentRate(mp);
                                  }}
                                  size={25}
                                />
                              );
                            }
                          })}
                          {/* <Rating
                      name="half-rating-read"
                      defaultValue={0.0}
                      precision={0.5}
                      readOnly
                      size="large"
                      onChange={(e, newVal) => {
                        console.log(newVal);
                      }}
                    /> */}
                        </div>
                        <div className="px-5">
                          <FilledTextarea
                            placeholder={"Write your Review here"}
                            inputRef={reviewInputRef}
                            onchange={() => {}}
                            label=""
                          />
                        </div>
                      </div>
                    </BottomSheet>
                  </div>

                  <div className="rounded-xl bg-[#f4f4f4] flex p-5 m-5 gap-8">
                    <div>
                      <div className="text-primary font-bold">Rating</div>
                      <div className="text-sm font-bold">
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                          {seller?.averageRating?.toFixed(1) ?? 0.0}
                        </span>{" "}
                        out of 5
                      </div>
                      <div className="text-sm">
                        Based on <span>{reviews?.length ?? 0}</span> reviews
                      </div>
                      <Rating
                        name="half-rating-read"
                        defaultValue={seller?.averageRating ?? 0}
                        precision={0.5}
                        readOnly
                        size="large"
                      />
                    </div>

                    <div className="text-sm">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ flexBasis: "50%" }}>
                          <div>5 stars</div>
                          <div>4 stars</div>
                          <div>3 stars</div>
                          <div>2 stars</div>
                          <div>1 star</div>
                        </div>
                        <div
                          className="space-y-1.5 pt-1.5"
                          style={{ flexBasis: "50%" }}
                        >
                          <Ratingbar
                            progress={
                              reviews === null
                                ? 0
                                : (getReviewBasedOfCount(5) / reviews.length) *
                                  100
                            }
                          />
                          <Ratingbar
                            progress={
                              reviews === null
                                ? 0
                                : (getReviewBasedOfCount(4) / reviews.length) *
                                  100
                            }
                          />
                          <Ratingbar
                            progress={
                              reviews === null
                                ? 0
                                : (getReviewBasedOfCount(3) / reviews.length) *
                                  100
                            }
                          />
                          <Ratingbar
                            progress={
                              reviews === null
                                ? 0
                                : (getReviewBasedOfCount(2) / reviews.length) *
                                  100
                            }
                          />
                          <Ratingbar
                            progress={
                              reviews === null
                                ? 0
                                : (getReviewBasedOfCount(1) / reviews.length) *
                                  100
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {reviews != null ? (
                    reviews!.map((post) => <SellerreviewItem data={post} />)
                  ) : (
                    <div>No Review For Seller!</div>
                  )}
                </div>
              )}
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
              {profile.bossup ? (
                <MobileBossOfTheWeek
                  bossOfTheWeek={profile.bossup!}
                  partnerData={partnerData}
                  partnerDatatile={partnerDatatile}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerReview;
