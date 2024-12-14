import React, { useState } from "react";
import Assets from "../../../../assets";
import ContactInformation from "./about";
import ProductCard from "../components/inventorycard";
import { AiFillStar } from "react-icons/ai";
import SellerReview from "../../../sellerreviews/SellerReview";
import ShopSellerReview from "./shopsellerreview";
import {
  StaggeredAlignment,
  StaggeredGrid,
  StaggeredGridItem,
  StaggeredGridItemFunctional,
  StaggeredItemSpan,
} from "react-staggered-grid";

const Shop = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-full">
      {/* Logo Section */}
      <img
        src="/logo192.png"
        alt="shop logo"
        className="w-full max-w-xs h-28 object-contain mb-4"
      />

      {/* Description Section */}
      <div className="text-sm w-full max-w-md text-gray-700 mb-2 text-center font-bold truncate">
        Shop Title
      </div>
      <div className="text-sm w-full max-w-md text-gray-700 mb-2 text-center font-medium">
        <p
          className={`overflow-hidden text-xs ${
            !showMore ? "line-clamp-1" : ""
          }`}
        >
          Shop Description very very very very very very very very very very
          very very very very very very very very very very long
        </p>
        <button
          className="text-black hover:text-black text-xs font-bold"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "see less..." : "read more..."}
        </button>
      </div>
      <div className="flex items-center justify-between mt-2 gap-1">
        <div className="text-xs text-gray-500 mb-4 text-center flex items-center gap-1">
          <Assets.location height={16} width={16} />
          {"Country"} •{" "}
        </div>
        <div className="text-xs text-gray-500 mb-4 text-center flex items-center gap-1">
          <AiFillStar size={16} color="#FFA500" />
          0.0 Reviews
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center justify-center gap-4 mb-4">
        <div className="flex flex-col items-center">
          <button className="bg-gray-200 rounded-full p-2 hover:bg-gray-300">
            <Assets.shopchat height={16} width={16} />
          </button>
          <div className="text-xs text-gray-500 mt-1">Chat</div>
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-gray-200 rounded-full p-2 hover:bg-gray-300">
            <Assets.shopcall height={16} width={16} />
          </button>
          <div className="text-xs text-gray-500 mt-1">Call</div>
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-gray-200 rounded-full p-2 hover:bg-gray-300">
            <Assets.shopshare height={16} width={16} />
          </button>
          <div className="text-xs text-gray-500 mt-1">Share</div>
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-gray-200 rounded-full p-2 hover:bg-gray-300">
            <Assets.shopreview height={16} width={16} />
          </button>
          <div className="text-xs text-gray-500 mt-1">Review</div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-md">
        <div className="flex flex-row items-center text-sm justify-around border-b border-gray-400">
          <div
            className={`p-2 cursor-pointer ${
              activeTab === 1
                ? "border-b-2 border-black text-black font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Listings
          </div>
          <div
            className={`p-2 cursor-pointer ${
              activeTab === 2
                ? "border-b-2 border-black text-black font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(2)}
          >
            Reviews
          </div>
          <div
            className={`p-2 cursor-pointer ${
              activeTab === 3
                ? "border-b-2 border-black text-black font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(3)}
          >
            About
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 1 && (
            <StaggeredGrid
              columns={2}
              style={{ width: "100%" }}
              useElementWidth={true}
              verticalGap={10}
              horizontalGap={10}
            >
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <StaggeredGridItem
                    key={index}
                    index={index}
                    spans={1}
                    style={{ transition: "left 0.3s ease,top 0.3s ease" }}
                  >
                    <ProductCard
                      title={`Product ${index + 1}`}
                      price={0}
                      imageUrl={""}
                      currencySymbol="USD"
                      description={`Description for product ${index + 1}`} // Example description
                      onCardClick={() => {
                        console.log(`Card ${index + 1} clicked`);
                      }}
                      onOrderClick={() => {
                        console.log(
                          `Order button for card ${index + 1} clicked`
                        );
                      }}
                    />
                  </StaggeredGridItem>
                ))}
            </StaggeredGrid>
          )}
          {activeTab === 2 && (
            <div>
              <ShopSellerReview />
            </div>
          )}
          {activeTab === 3 && <ContactInformation />}
        </div>
      </div>
    </div>
  );
};

export default Shop;
