import React, { useState } from "react";
import TranslucentDiv from "../../../../common/components/buttons/Translucentbutton";
import Lightbox from "react-spring-lightbox";
import Assets from "../../../../assets";
import { ImagesListItem } from "react-spring-lightbox/dist/types/ImagesList";
import { useLocation } from "react-router-dom";
import { Product } from "../../../../common/interfaces/Product";
import { Service } from "../../../../common/interfaces/Service";

const Expandedshop = () => {
  const location = useLocation();
  const data = location.state?.data as Product | Service;
  const [showExpandedImages, setShowExpandedImages] = useState<boolean>(false);

  const handleExpanded = () => {
    setShowExpandedImages(true);
  };

  const images: ImagesListItem[] = (data?.images || []).map(
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
    currentImageIndex + 1 < images.length &&
    setCurrentIndex(currentImageIndex + 1);
  if (!data) {
    return (
      <div className="flex flex-col bg-white h-screen items-center justify-center p-4 ">
        No item details available.
      </div>
    );
  }

  const isProduct = (item: Product | Service): item is Product =>
    "price" in item;
  const isService = (item: Product | Service): item is Service =>
    "serviceType" in item;
  return (
    <div className="flex flex-col bg-white h-screen items-center justify-start p-4 ">
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
      {data?.images && data.images[0] && (
        <img
          onClick={handleExpanded}
          src={data.images[0]}
          alt=""
          className="rounded-lg w-full h-64 object-cover"
        />
      )}
      <div className="flex flex-col items-start justify-center mt-4 w-full max-w-xs">
        <div className="font-bold text-md">{data.name}</div>
        <div className="flex items-center space-x-2">
          {data?.discount && data.discount > 0 ? (
            <>
              <div className="font-bold text-lg text-red-500">
                {data.shop?.currency}
                {(data.price * (1 - data.discount / 100) * 100).toFixed(2)}
              </div>
              <div className="text-gray-500 line-through">
                {data.shop?.currency}
                {data.price.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="font-bold text-lg">
              {data?.shop?.currency}
              {data?.price?.toFixed(2)}
            </div>
          )}
        </div>
        <div className="font-[600] text-sm">Product Description</div>
        <div className="text-gray-700 text-sm">{data.description}</div>
      </div>
      <div className="relative w-full max-w-xs overflow-hidden rounded-2xl mt-5">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-transparent to-white opacity-50"></div>
        <img
          src={Assets.orderonapp}
          alt="Appstorelogo"
          className="w-full relative z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end pb-3 items-center z-20 gap-2">
          <div className="px-5 text-center text-white text-sm font-bold">
            Continue to Order this product on the Business Bosses App
          </div>
          <div className="px-5 w-full">
            <div className="mt-3 flex justify-center items-center gap-2">
              <div className="w-1/3 flex justify-center">
                <Assets.Appstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                  }
                />
              </div>
              <div className="w-1/3 flex justify-center">
                <Assets.Playstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expandedshop;
