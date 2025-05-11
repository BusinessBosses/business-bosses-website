import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiSearch, FiX, FiCheck } from "react-icons/fi";
import { Modal } from "@mui/material";

import ClientWidget from "../components/clientwidget";
import { Client, ClientType } from "../models/client";
import CustomTabBarWidget from "../../tasks/components/customtabbar";
import ProCustomButton from "../../biz-center/components/procustombutton";
import Spinner from "../../tasks/components/spinner";

interface Supplier {
  id: string;
  name: string;
  // Add other supplier properties as needed
}

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showAddSupplierModal, setShowAddSupplierModal] =
    useState<boolean>(false);
  const [showImportSupplierModal, setShowImportSupplierModal] =
    useState<boolean>(false);
  const [selectedFilterOption, setSelectedFilterOption] = useState("None");
  const mainListScrollRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setClients([]); // Replace with actual clients
      setSuppliers([]); // Replace with actual suppliers
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

  const getClientsByType = (type: ClientType): Client[] => {
    if (type === ClientType.ALL_CLIENTS) return clients;
    return clients.filter((client) => client.type === type);
  };

  // Filter & sort logic for clients
  useEffect(() => {
    let items = [...clients];
    switch (selectedFilterOption) {
      case "Newest first":
        // Assuming clients have a createdAt date
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      // Add other filter options as needed
      default:
        break;
    }
    setClients(items);
  }, [selectedFilterOption]);

  const customerTypeTabs = ["All Clients", "Online", "In-Person", "Suppliers"];

  return (
    <div className="bg-gray-50 rounded-2xl min-h-screen w-full flex flex-col items-center">
      {/* Header */}
      <header className="w-full rounded-t-2xl bg-white border-b px-5">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <ProCustomButton
            text="Add Customer"
            icon={<FiPlus className="mr-2" />}
            onPressed={() => setShowAddClientModal(true)}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="sm:container px-4 sm:px-0 w-full pt-5">
        {/* Customers Content */}

        {/* Custom Tab Bar for customer types */}

        <CustomTabBarWidget
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          scrollToSection={scrollToSection}
          proprimaryColor="#000"
          backgroundColor={["#6b7280", "#000"]}
          listofitems={customerTypeTabs}
          itemToString={(item) => item}
          filterOptions={["Newest first", "None"]}
          onFilterSelected={(opt) => opt && setSelectedFilterOption(opt)}
        />

        {loading ? (
          <div className="h-64 pt-52">
            <Spinner color="black" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-medium text-gray-900">
              No Customers Found!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your customer task to get started
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden w-full sm:container px-4 sm:px-0"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {/* All Clients Column */}
            <div className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  All Clients ({getClientsByType(ClientType.ALL_CLIENTS).length}
                  )
                </h3>
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
                ) : getClientsByType(ClientType.ALL_CLIENTS).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No clients found
                  </div>
                ) : (
                  getClientsByType(ClientType.ALL_CLIENTS).map((client) => (
                    <ClientWidget
                      key={client.id}
                      client={client}
                      bgColor={""}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Online Clients Column */}
            <div className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <h3 className="text-sm font-bold text-gray-900">
                  Online ({getClientsByType(ClientType.ONLINE).length})
                </h3>
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
                ) : getClientsByType(ClientType.ONLINE).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Drag online clients here
                  </div>
                ) : (
                  getClientsByType(ClientType.ONLINE).map((client) => (
                    <ClientWidget
                      key={client.id}
                      client={client}
                      bgColor={""}
                    />
                  ))
                )}
              </div>
            </div>

            {/* In-Person Clients Column */}
            <div className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <h3 className="text-sm font-bold text-gray-900">
                  In-Person ({getClientsByType(ClientType.IN_PERSON).length})
                </h3>
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
                ) : getClientsByType(ClientType.IN_PERSON).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Drag in-person clients here
                  </div>
                ) : (
                  getClientsByType(ClientType.IN_PERSON).map((client) => (
                    <ClientWidget
                      key={client.id}
                      client={client}
                      bgColor={""}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Suppliers Column */}
            <div className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Suppliers ({suppliers.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddSupplierModal(true)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Add Supplier
                </button>
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
                      <div
                        key={supplier.id}
                        className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                          <h3 className="text-sm font-bold text-gray-900">
                            {supplier.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowImportSupplierModal(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Import
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        open={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Client</h2>
          {/* Add client form content here */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              onClick={() => setShowAddClientModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              onClick={() => setShowAddClientModal(false)}
            >
              Add Client
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Supplier</h2>
          {/* Add supplier form content here */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              onClick={() => setShowAddSupplierModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              onClick={() => setShowAddSupplierModal(false)}
            >
              Add Supplier
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showImportSupplierModal}
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

export default Customers;
