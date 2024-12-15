import React, { useState } from "react";
import TranslucentDiv from "../../../../common/components/buttons/Translucentbutton";
import Lightbox from "react-spring-lightbox";
import Assets from "../../../../assets";
import { ImagesListItem } from "react-spring-lightbox/dist/types/ImagesList";
import { Post } from "../../../../common/interfaces/post";

interface Props {
  data: Post;
}

const expandedshop = ({ data }: Props) => {
  const [showExpandedImages, setShowExpandedImages] = useState<boolean>(false);
  const handleExpanded = () => {
    setShowExpandedImages(true);
  };

  const images: ImagesListItem[] = (data.images || []).map(
    (imageUrl, index) => ({
      src: imageUrl,
      loading: "lazy",
      alt: `Image ${index + 1}`,
    })
  );

  const [currentImageIndex, setCurrentIndex] = useState(0);

  const gotoPrevious = () =>
    currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

  const gotoNext = () =>
    currentImageIndex + 1 < images?.length! &&
    setCurrentIndex(currentImageIndex + 1);

  return (
    <div>
      <div className="flex flex-col gap-4 items-start py-2">
        <Lightbox
          className="lg:p-10 p-5"
          style={{ background: "rgba(0, 0, 0, 0.98)" }}
          isOpen={showExpandedImages}
          onPrev={gotoPrevious}
          onNext={gotoNext}
          images={images}
          currentIndex={currentImageIndex}
          renderFooter={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setShowExpandedImages(false)}
            >
              <TranslucentDiv />
            </div>
          )}
          renderPrevButton={() => (
            <Assets.Backbutton
              style={{ position: "relative", zIndex: "500" }}
              onClick={gotoPrevious}
            />
          )}
          renderNextButton={() => (
            <Assets.Backbutton
              style={{ transform: "rotate(180deg)" }}
              onClick={gotoNext}
            />
          )}
          pageTransitionConfig={{
            from: { transform: "scale(0.75)", opacity: 0 },
            enter: { transform: "scale(1)", opacity: 1 },
            leave: { transform: "scale(0.75)", opacity: 0 },
            config: { mass: 1, tension: 320, friction: 32 },
          }}
        />
        {/* {data.images[0] && (
          <img
            onClick={() => {
              handleExpanded();
            }}
            src={data.images[0]}
            alt=""
            className="rounded-lg w-full h-64 object-cover"
          />
        )} */}
        <div> Title</div>
        <div>Product Description</div>
        <div>Description Text</div>
      </div>
    </div>
  );
};

export default expandedshop;
function setShowExpandedImages(arg0: boolean) {
  throw new Error("Function not implemented.");
}
