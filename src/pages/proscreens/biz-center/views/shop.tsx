import React, { useEffect, useState } from "react";
import Assets from "../../../../assets";
import ContactInformation from "./about";
import ProductCard from "../components/inventorycard";
import { AiFillStar } from "react-icons/ai";
import ShopSellerReview from "./shopsellerreview";
import { StaggeredGrid, StaggeredGridItem } from "react-staggered-grid";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/store/store";
import { Shop } from "../../../../common/interfaces/Shop";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import RoutesPath from "../../../../constants/Routes";
import { Product } from "../../../../common/interfaces/Product";
import { Service } from "../../../../common/interfaces/Service";
import ServiceCard from "../components/servicecard";
import ShopController from "../controllers/ShopController";

const ShopView = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const navigate = useNavigate();
  const { value } = useParams();

  const fetchData = async (shopId: string) => {
    const shopValue = shopId.replace(/-/g, " ");
    setLoading(true);
    setErr(false);
    try {
      const response = await ShopController.fetchShop(shopValue);
      console.log(response);

      if (response.success && response.data) {
        setShop(response.data);
        const responseProducts = await ShopController.fetchProducts(
          response.data.userId
        );
        console.log(responseProducts);

        if (responseProducts.success && responseProducts.data) {
          setProducts(
            responseProducts.data.rows.map((mp: Product) => ({ ...mp }))
          );
          const responseServices = await ShopController.fetchServices(
            response.data.userId
          );
          console.log(responseServices);

          if (responseServices.success && responseServices.data) {
            setServices(
              responseServices.data.rows.map((mp: Service) => ({ ...mp }))
            );
          } else {
            setErr(true);
          }
        } else {
          setErr(true);
        }
      } else {
        setErr(true);
      }
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
    console.log(loading);

    console.log(err);
    console.log(products);
  };

  useEffect(() => {
    if (value) fetchData(value);
  }, [value]);

  if (loading) {
    return (
      <FetchStatus
        error={false}
        loading={true}
        errorMessage="Loading shop details..."
        onReload={() => {}}
      />
    );
  }

  if (err) {
    return (
      <FetchStatus
        error={true}
        loading={false}
        errorMessage="Failed to load shop details."
        onReload={() => fetchData(value!)}
      />
    );
  }
  const combinedItems = [...products, ...services].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="flex flex-col bg-white items-center justify-start p-4">
      {/* Shop Logo */}
      <img
        src={"/logo192.png"}
        alt="Shop Logo"
        className="w-full max-w-xs h-28 object-contain mb-4"
      />

      {/* Shop Info */}
      <div className="text-sm font-bold truncate mb-2">{shop?.name}</div>
      <div className="text-xs text-gray-700 mb-2 text-center">
        <p className={`overflow-hidden ${!showMore ? "line-clamp-1" : ""}`}>
          {shop?.description}
        </p>
        <button
          className="text-black font-bold text-xs"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "See less" : "Read more"}
        </button>
      </div>

      {/* Shop Location and Reviews */}
      <div className="flex justify-between w-full max-w-md mt-2">
        <div className="text-xs flex items-center gap-1">
          <Assets.location height={16} width={16} />
          {shop?.location}
        </div>
        <div className="text-xs flex items-center gap-1">
          <AiFillStar size={16} color="#FFA500" />
          {shop?.user?.averageRating} Reviews
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

      {/* Tabs */}
      <div className="w-full max-w-md">
        <div className="flex justify-around border-b">
          {["Listings", "Reviews", "About"].map((tab, idx) => (
            <div
              key={idx}
              className={`p-2 cursor-pointer ${
                activeTab === idx + 1 ? "border-b-2 font-bold" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(idx + 1)}
            >
              {tab}
            </div>
          ))}
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
              {combinedItems.map((item, index) => (
                <StaggeredGridItem
                  key={index}
                  index={index}
                  spans={1}
                  style={{ transition: "left 0.3s ease,top 0.3s ease" }}
                >
                  {!item.hasOwnProperty("serviceType") && item.isActive ? (
                    <ProductCard
                      title={item.name}
                      price={item.price}
                      imageUrl=""
                      currencySymbol={item.shop?.currency}
                      description={item.description}
                      onCardClick={() =>
                        navigate(RoutesPath.expandedshop, {
                          state: { data: item },
                        })
                      }
                      onOrderClick={() =>
                        console.log(
                          `Order button for card ${index + 1} clicked`
                        )
                      }
                    />
                  ) : item.isActive ? (
                    <ServiceCard
                      title={item.name}
                      description={item.description}
                      price={item.price}
                      currencySymbol={item.shop?.currency}
                      onCardClick={() =>
                        navigate(RoutesPath.expandedshop, {
                          state: { data: item },
                        })
                      }
                      imageUrl={""}
                      onOrderClick={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  ) : null}
                </StaggeredGridItem>
              ))}
            </StaggeredGrid>
          )}
          {activeTab === 2 && <ShopSellerReview />}
          {activeTab === 3 && <ContactInformation shop={shop!} />}
        </div>
      </div>
    </div>
  );
};

export default ShopView;
