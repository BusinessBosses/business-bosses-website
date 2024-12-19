import { useEffect, useRef, useState } from "react";

import Rating from "@mui/material/Rating/Rating";
import { BottomSheet } from "react-spring-bottom-sheet";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Helmet } from "react-helmet";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import { User } from "../../../../common/interfaces/user";
import serviceApi from "../../../../services/serviceApi";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import FilledTextarea from "../../../../common/components/inputs/FilledTextarea";
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

interface Props {
  user: User;
}

const ShopSellerReview: React.FC<Props> = ({ user }) => {
  // const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<boolean>(false);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
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
      sellerId: user?.uid,
      rating: currentRate,
      reviewText: reviewInputRef.current?.value.trim() ?? "",
    });
    if (response.success) {
      getUserReviews(user!.uid);
      setOpen(false);
      setRating(false);
    }
  };

  useEffect(() => {
    // setSeller(user);
    getUserReviews(user!.uid);
  }, []);

  return (
    <div>
      <Helmet>
        <title>{`${
          user?.name ?? user?.username
        }'s Reviews - Business Bosses`}</title>
      </Helmet>

      <div>
        <div
          className=" top-0 w-full z-50"
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
          <div className="bg-white">
            <div className="flex-row justify-center">
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
                      onchange={function (): void {
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
                    {user?.averageRating?.toFixed(1) ?? 0.0}
                  </span>{" "}
                  out of 5
                </div>
                <div className="text-sm">
                  Based on <span>{reviews?.length ?? 0}</span> reviews
                </div>
                <Rating
                  name="half-rating-read"
                  defaultValue={user?.averageRating ?? 0}
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
                        reviews.length === 0
                          ? 0
                          : (getReviewBasedOfCount(5) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews.length === 0
                          ? 0
                          : (getReviewBasedOfCount(4) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews.length === 0
                          ? 0
                          : (getReviewBasedOfCount(3) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews.length === 0
                          ? 0
                          : (getReviewBasedOfCount(2) / reviews.length) * 100
                      }
                    />
                    <Ratingbar
                      progress={
                        reviews.length === 0
                          ? 0
                          : (getReviewBasedOfCount(1) / reviews.length) * 100
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {reviews.length !== 0 ? (
              reviews.map((post) => <SellerreviewItem data={post} />)
            ) : (
              <div className="flex justify-center items-center">
                No Review For Seller!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSellerReview;
