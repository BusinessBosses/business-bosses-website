import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Assets from "../../../assets";
import OrdersWidget from "./components/orderscard";
import GotoshopWidget from "./components/gotoshopwidget";
import NotificationButton from "./components/notificationbutton";
import InfoCard from "./components/infocard";
import QuickActionCard from "./components/quickactioncard";
import serviceApi from "../../../services/serviceApi";
import ShopController from "../biz-center/controllers/ShopController";
import { useAppSelector } from "../../../redux/store/store";
import FinancialAnalysisWidget from "./components/finalanalysiscard";

const Dashboard = ({ noBack = true }: { noBack?: boolean }) => {
  const router = useRouter();
  const [selectedFilterItem, setSelectedFilterItem] = useState("All Time");
  const [selectedDateFilter, setSelectedDateFilter] = useState("all_time");
  const [loadingData, setLoadingData] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    paid: 0,
    cancelled: 0,
    totalOrders: 0,
  });
  const [shopStats, setShopStats] = useState({
    totalAmount: 0,
    totalExpenses: 0,
    clientCount: 0,
    views: 0,
    projectCount: 0,
  });
  const profile = useAppSelector((state) => state.user);
  const shop = useAppSelector((state) => state.shop.shopInfo);

  const titles = ["Customers", "Visitors", "To-do tasks"];
  const quickActions = ["Add Listing", "Create Orders", "Add Customers"];

  useEffect(() => {
    // Define an async function to simulate fetching stats data
    const loadData = async () => {
      // Simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statistics = await ShopController.loadStatistics(
        shop!.id,
        profile.profile!.uid
      );
      console.log(statistics);

      // Simulated fetched data for order and shop statistics
      const fetchedOrderStats = {
        pending: Number(statistics.orderData.data.pending),
        paid: Number(statistics.orderData.data.paid),
        cancelled: Number(statistics.orderData.data.cancelled),
        totalOrders: Number(statistics.orderData.data.totalOrders),
      };
      const fetchedShopStats = {
        totalAmount: Number(statistics.shopData.data.totalAmount),
        totalExpenses: Number(statistics.shopData.data.totalExpenses),
        clientCount: Number(statistics.shopData.data.clientCount),
        views: Number(statistics.shopData.data.views),
        projectCount: Number(statistics.shopData.data.projectCount),
      };

      // Set the state values with the fetched data
      setOrderStats(fetchedOrderStats);
      setShopStats(fetchedShopStats);
      setLoadingData(false);
    };

    loadData();
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
    <div className="bg-gray-50 rounded-2xl min-h-screen w-full flex flex-col items-center">
      {/* Header */}
      <header className="w-full rounded-t-2xl bg-white border-b px-5">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      {/* App Bar */}

      {/* Main Content */}
      <div className="mx-auto px-4 py-4 gap-5 flex flex-col md:container">
        {/* Filter Button */}
        <div className="mt-2 flex justify-end">
          <div className="">
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
              <div className="absolute right-20 mt-2 w-48 bg-white  rounded-lg shadow-lg z-0 py-1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
          <div className="h-full">
            <OrdersWidget orderStats={orderStats} />
          </div>
          <div className="h-full">
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
              //     if (index === 0) router.push("/clients");
              //     else if (index === 2) router.push("/tasks");
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
