<<<<<<< HEAD
export {};
=======
import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiMessageSquare,
  FiCheck,
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Modal from "./components/modal";
import ClientWidget from "./components/clientwidget";
import CampaignItem from "./components/campaignitem";
import AddClientModal from "./components/addclient";
import AddSupplierModal from "./components/addsupplier";
import CampaignPage from "./components/campaignpage";
import PremiumScreen from "./components/premiumscreen";
import SuppliersCard from "./components/supplierscard";

enum ClientType {
  ALL = "all",
  ONLINE = "online",
  INPERSON = "inPerson",
  BBUSER = "bbUser",
}

interface Client {
  id: string;
  name: string;
  type: ClientType;
  // Add other client properties as needed
}

interface Campaign {
  id: string;
  campaignName: string;
  // Add other campaign properties as needed
}

interface Supplier {
  id: string;
  name: string;
  // Add other supplier properties as needed
}

const ClientsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSupplier, setLoadingSupplier] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showAddSupplierModal, setShowAddSupplierModal] =
    useState<boolean>(false);
  const [showImportSupplierModal, setShowImportSupplierModal] =
    useState<boolean>(false);
  const mainListScrollRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setClients([]); // Replace with actual clients
      setCampaigns([]); // Replace with actual campaigns
      setSuppliers([]); // Replace with actual suppliers
      setFilteredCampaigns([]); // Replace with actual campaigns
      setLoading(false);
    };
    loadData();
  }, []);

  const scrollToSection = (index: number) => {
    if (mainListScrollRef.current) {
      mainListScrollRef.current.scrollTo({
        left: index * window.innerWidth * 0.9,
        behavior: "smooth",
      });
    }
  };

  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const el = mainListScrollRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const left = el.scrollLeft;
      if ((left <= 20 && !isRight) || (left >= max - 20 && isRight)) return;
      el.scrollTo({ left: left + (isRight ? 50 : -50), behavior: "smooth" });
      moveMainList(isRight);
    }, 100);
  };

  const handleSearchCampaigns = (query: string) => {
    setSearchQuery(query);
    setFilteredCampaigns(
      campaigns.filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const getClientsByType = (type: ClientType): Client[] => {
    if (type === ClientType.ALL) return clients;
    return clients.filter((client) => client.type === type);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Clients</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
                  onClick={() => setShowAddClientModal(true)}
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <FiMessageSquare className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center relative">
                <IoMdNotificationsOutline className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <Tabs
          selectedIndex={activeTab}
          onSelect={(index) => setActiveTab(index)}
        >
          <TabList className="flex border-b border-gray-200">
            <Tab className="px-4 py-2 font-medium text-sm focus:outline-none">
              Customers
            </Tab>
            <Tab className="px-4 py-2 font-medium text-sm focus:outline-none">
              Campaign
            </Tab>
          </TabList>

          <TabPanel>
            {/* Customers Tab */}
            <div className="mt-4">
              <div
                className="flex overflow-x-auto pb-4 scrollbar-hidden"
                ref={mainListScrollRef}
              >
                {[
                  ClientType.ALL,
                  ClientType.ONLINE,
                  ClientType.INPERSON,
                  ClientType.BBUSER,
                ].map((type, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        {type !== ClientType.ALL && (
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              type === ClientType.ONLINE
                                ? "bg-green-500"
                                : type === ClientType.INPERSON
                                ? "bg-blue-500"
                                : type === ClientType.BBUSER
                                ? "bg-purple-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                        )}
                        <h3 className="text-sm font-bold text-gray-900">
                          {type === ClientType.ALL
                            ? "All Clients"
                            : type === ClientType.ONLINE
                            ? "Online"
                            : type === ClientType.INPERSON
                            ? "In-Person"
                            : "BB User"}{" "}
                          ({getClientsByType(type).length})
                        </h3>
                      </div>

                      {type === ClientType.ALL && (
                        <div className="flex items-center">
                          {showSearchBar ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <button
                                onClick={() => {
                                  setShowSearchBar(false);
                                  setSearchQuery("");
                                }}
                                className="ml-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowSearchBar(true)}
                              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                            >
                              <FiSearch className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 my-2"></div>

                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "calc(100vh - 250px)" }}
                    >
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : getClientsByType(type).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          {type === ClientType.ALL
                            ? "No clients found"
                            : "Drag clients here"}
                        </div>
                      ) : (
                        getClientsByType(type).map((client) => (
                          <ClientWidget key={client.id} client={client} />
                        ))
                      )}
                    </div>
                  </div>
                ))}

                {/* Suppliers Column */}
                <div className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Suppliers ({suppliers.length})
                      </h3>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "calc(100vh - 250px)" }}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : suppliers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No suppliers found
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {suppliers.map((supplier) => (
                          <SuppliersCard
                            key={supplier.id}
                            supplier={supplier}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            {/* Campaign Tab */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiCheck className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No Campaigns Yet!
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first campaign to get started
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="relative mb-4">
                  <div className="flex items-center bg-white rounded-lg px-3 py-2">
                    <FiSearch className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="flex-1 outline-none text-sm"
                      placeholder="Search Campaigns"
                      value={searchQuery}
                      onChange={(e) => handleSearchCampaigns(e.target.value)}
                    />
                    <button className="ml-2 p-1 rounded-lg bg-gray-100">
                      <span className="text-xs text-gray-600">Filter</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignItem key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
      >
        <AddClientModal onClose={() => setShowAddClientModal(false)} />
      </Modal>

      <Modal
        isOpen={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
      >
        <AddSupplierModal onClose={() => setShowAddSupplierModal(false)} />
      </Modal>

      <Modal
        isOpen={showImportSupplierModal}
        onClose={() => setShowImportSupplierModal(false)}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Import Supplier</h2>
          {/* Add import supplier content here */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              onClick={() => setShowImportSupplierModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              onClick={() => setShowImportSupplierModal(false)}
            >
              Import
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsScreen;
>>>>>>> parent of c3320f8 (ui changes)
