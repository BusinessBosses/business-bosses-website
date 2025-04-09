import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shop } from "../../../common/interfaces/Shop";
import Assets from "../../../assets";
import OrdersWidget from "./components/orderscard";
import FinancialAnalysisWidget from "./components/finalanalysiscard";
import GotoshopWidget from "./components/gotoshopwidget";
import NotificationButton from "./components/notificationbutton";
import InfoCard from "./components/infocard";
import QuickActionCard from "./components/quickactioncard";

const Dashboard = ({ noBack = true }: { noBack?: boolean }) => {
  const navigate = useNavigate();
  const [selectedFilterItem, setSelectedFilterItem] = useState("All Time");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all_time");
  const [loadingData, setLoadingData] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock data - replace with your actual data fetching logic
  // const orderStats: OrderStats = {
  //   pending: 5,
  //   paid: 10,
  //   cancelled: 2,
  //   totalOrders: 17,
  // };

  // const shopStats: ShopStats = {
  //   totalAmount: 5000,
  //   totalExpenses: 2000,
  //   clientCount: 42,
  //   views: 128,
  //   projectCount: 7,
  // };

  const orderStats = {
    pending: 5,
    paid: 10,
    cancelled: 2,
    totalOrders: 17,
  };

  const shopStats = {
    totalAmount: 5000,
    totalExpenses: 2000,
    clientCount: 42,
    views: 128,
    projectCount: 7,
  };

  const titles = ["Customers", "Visitors", "To-do tasks"];
  const quickActions = ["Add Listing", "Create Orders", "Add Customers"];

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
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>Loading Statistics...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl min-h-screen">
      {/* Main Content */}
      <div className="mx-auto px-4 py-4 gap-5 flex flex-col md:container">
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
              className="bg-white border-backgroundcolor border px-4 py-2 rounded-lg flex items-center shadow-sm"
            >
              <img
                src={Assets.filterprosections}
                alt="Filter"
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">{selectedFilterItem}</span>
              <img
                src={Assets.dropdown}
                alt="Dropdown"
                className="w-2.5 h-2.5 ml-2"
              />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white  rounded-lg shadow-lg z-0 py-1">
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

        <div className="flex flex-col md:flex-row gap-4 w-full h-full">
          <div className="flex-1 h-full">
            <OrdersWidget orderStats={orderStats} />
          </div>
          <div className="flex-1 h-full">
            <FinancialAnalysisWidget
              shop={{ currency: "USD" }}
              shopStats={shopStats}
            />
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex flex-row justify-between overflow-x-auto gap-2 px-2 mt-4 no-scrollbar">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action}
              cardName={action}
              value={index === 0 ? "42" : "0"} // Mock data
              color={index === 0 ? "black" : index === 1 ? "orange" : "purple"}
              assetLocation={
                index === 0
                  ? Assets.plusIcon
                  : index === 1
                  ? Assets.addOrderIcon
                  : Assets.addClientIcon
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
