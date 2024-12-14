import { ChangeEvent, useEffect, useRef, useState } from "react";

import Rating from "@mui/material/Rating/Rating";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Helmet } from "react-helmet";
import CommonPageHeader from "../../../../common/components/headers/CommonPageHeader";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import PublicProfileDetailsonly from "../../../profile/views/components/PublicProfileDetailsonly";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import serviceApi from "../../../../services/serviceApi";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import FilledTextarea from "../../../../common/components/inputs/FilledTextarea";
import FilledButtonsmall from "../../../../common/components/buttons/FilledButtonsmall";
import Ratingbar from "../../../sellerreviews/components/Ratingbar";
import SellerreviewItem from "../../../sellerreviews/components/SellerreviewItem";

interface Review {
  id: number;
  sellerId: string;
  rating: number;
  userId: string;
  reviewText?: string;
  rater: User;
  createdAt: string;
}

const ShopSellerReview: React.FC = () => {
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<boolean>(false);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const navigate = useNavigate();
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
      setReviews(revs);
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
      setOpen(false);
      setRating(false);
    }
  };

  useEffect(() => {
    const state = location.state;
    if (!!!state) {
      //   navigate(-1);
      return;
    } else {
      setSeller(state);
      getUserReviews(state.uid);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>{`${seller?.username}'s Reviews - Business Bosses`}</title>
      </Helmet>

      <div className="mobile-only">
        <div
          className=" top-0 w-full z-50 mobile-only "
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        ></div>
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
                {seller ? <PublicProfileDetailsonly data={seller} /> : null}
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
                onDismiss={() => setOpen(false)}
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
                    {[1, 2, 3, 4, 5].map((mp) => (
                      <div key={mp} onClick={() => setCurrentRate(mp)}>
                        {currentRate >= mp ? (
                          <AiFillStar size={25} color="yellow" />
                        ) : (
                          <AiOutlineStar size={25} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-5">
                    <FilledTextarea
                      placeholder={"Write your Review here"}
                      inputRef={reviewInputRef}
                      label=""
                      onchange={function (
                        event: ChangeEvent<HTMLTextAreaElement>
                      ): void {
                        throw new Error("Function not implemented.");
                      }}
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
            {/* {reviews?.map((review) => (
              <SellerreviewItem key={review.id} data={review} />
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSellerReview;
