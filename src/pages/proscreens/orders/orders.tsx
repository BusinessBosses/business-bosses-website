import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrdersWidget from "../dashboard/components/orderscard";
import FinancialAnalysisWidget from "../dashboard/components/finalanalysiscard";
import InfoCard from "../dashboard/components/infocard";
import QuickActionCard from "../dashboard/components/quickactioncard";
import GotoshopWidget from "../dashboard/components/gotoshopwidget";
import NotificationButton from "../dashboard/components/notificationbutton";
import Assets from "../../../assets";
import { useAppSelector } from "../../../redux/store/store";

type OrderStats = {
  pending: number;
  paid: number;
  cancelled: number;
  totalOrders: number;
};

type ShopStats = {
  totalAmount: number;
  totalExpenses: number;
  clientCount: number;
  views: number;
  projectCount: number;
};

type Shop = {
  currency: string;
};

const Dashboard = ({ noBack = true }: { noBack?: boolean }) => {
  const navigate = useNavigate();
  const [selectedFilterItem, setSelectedFilterItem] = useState("All Time");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all_time");
  const [loadingData, setLoadingData] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock data - replace with your actual data fetching logic
  const orderStats: OrderStats = {
    pending: 5,
    paid: 10,
    cancelled: 2,
    totalOrders: 17,
  };

  const shopStats: ShopStats = {
    totalAmount: 5000,
    totalExpenses: 2000,
    clientCount: 42,
    views: 128,
    projectCount: 7,
  };

  const currentShop: Shop = { currency: "USD" };

  const titles = ["Customers", "Visitors", "To-do tasks"];
  const quickActions = ["Add Listing", "Create Orders", "Add Customers"];
    const shop = useAppSelector((state) => state.shop.shopInfo);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoadingData(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilterItem(filter);
    setShowFilterMenu(false);

    // Map filter to date filter value
    let dateFilter = "all_time";
    if (filter === "Today") dateFilter = "today";
    else if (filter === "Last 7 Days") dateFilter = "last_7_days";
    else if (filter === "Last 30 Days") dateFilter = "last_30_days";

    setSelectedDateFilter(dateFilter);
    // Here you would typically call your data filtering function
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>Loading Statistics...</div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* App Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <GotoshopWidget shop={shop!} />
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/chat")}
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <img
                src={Assets.NotificationIcon}
                alt="Chat"
                className="w-5 h-5"
              />
            </button>
            <NotificationButton hasUnreadNotification={true} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Back Button (conditionally rendered) */}
        {!noBack && (
          <button
            onClick={() => navigate("/home")}
            className="mt-2 ml-2 px-3 py-1 bg-blue-100 rounded-full flex items-center text-blue-600"
          >
            <span className="mr-1">←</span>
            
          </button>
        )}

        {/* Filter Button */}
        <div className="mt-2 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="bg-white px-4 py-2 rounded-lg flex items-center shadow-sm"
            >
              <img
                src={Assets.filterprosections}
                alt="Filter"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm">{selectedFilterItem}</span>
              <img src={Assets.dropdown} alt="Dropdown" className="w-5 h-5 ml-2" />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                <div className="px-4 py-2 font-bold border-b">
                  Filter Data By
                </div>
                {["Today", "Last 7 Days", "Last 30 Days", "All Time"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedFilterItem === option
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Widgets */}
        <OrdersWidget orderStats={orderStats} />
        <FinancialAnalysisWidget shop={currentShop} shopStats={shopStats} />

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-2">
          {titles.map((title, index) => (
            <InfoCard
              key={title}
              cardName={title}
              value={
                index === 0
                  ? shopStats.clientCount.toString()
                  : index === 1
                  ? shopStats.views.toString()
                  : shopStats.projectCount.toString()
              }
              //   onClick={() => {
              //     if (index === 0) navigate("/clients");
              //     else if (index === 2) navigate("/tasks");
              //   }}
            />
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-2">
          {quickActions.map((action, index) => (
            <QuickActionCard
                  key={action}
                  cardName={action}
                  value={index === 0 ? "42" : "0"} // Mock data
                  color={index === 0 ? "black" : index === 1 ? "orange" : "purple"} assetLocation={""}            //   assetLocation={
            //     index === 0
            //       ? Assets.plusIcon
            //       : index === 1
            //       ? Assets.addOrderIcon
            //       : Assets.addClientIcon
            //   }
              //   onClick={() => {
              //     if (index === 0) navigate("/add-listing");
              //     else if (index === 1) navigate("/create-order");
              //     else if (index === 2) navigate("/add-client");
              //   }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
