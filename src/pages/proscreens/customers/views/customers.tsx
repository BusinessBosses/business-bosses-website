import { Box, Modal, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BottomSheet } from "react-spring-bottom-sheet";
import ProCustomButton from "../../biz-center/components/procustombutton";
import CustomTabBarWidget from "../../tasks/components/customtabbar";
import Spinner from "../../tasks/components/spinner";
import AddClientModal from "../components/addclientmodal";
import ClientWidget from "../components/clientwidget";
import { Client, ClientType } from "../models/client";
import SupplierWidget from "../components/supplierwidget"; // Import SupplierWidget

interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  lastOrder: string;
  description: string; // Added missing property
  location: string; // Added missing property
}

// Dummy client data
const dummyClients: Client[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    type: ClientType.ONLINE,
    createdAt: new Date("2025-04-15"),
    orderCount: 5,
    totalAmountSpent: 1200.75,
    userId: "user123",
    image: ["https://randomuser.me/api/portraits/men/1.jpg"],
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    type: ClientType.IN_PERSON,
    createdAt: new Date("2025-05-01"),
    orderCount: 3,
    totalAmountSpent: 850.25,
    userId: "user123",
    image: ["https://randomuser.me/api/portraits/women/2.jpg"],
  },
  {
    id: "c3",
    name: "Michael Brown",
    email: "mbrown@example.com",
    phone: "+1 (555) 222-3333",
    type: ClientType.ONLINE,
    createdAt: new Date("2025-05-08"),
    orderCount: 1,
    totalAmountSpent: 320.5,
    userId: "user123",
    image: ["https://randomuser.me/api/portraits/men/3.jpg"],
  },
];

// Dummy supplier data
const dummySuppliers: Supplier[] = [
  {
    id: "s1",
    name: "TechSupplies Inc.",
    category: "Electronics",
    contactPerson: "David Chen",
    email: "david@techsupplies.com",
    phone: "+1 (555) 111-2222",
    address: "1000 Tech Blvd, San Jose, CA",
    lastOrder: "2025-05-01",
    description: "",
    location: "",
  },
  {
    id: "s2",
    name: "Office Essentials",
    category: "Office Supplies",
    contactPerson: "Lisa Wong",
    email: "lwong@officeessentials.com",
    phone: "+1 (555) 222-3333",
    address: "500 Commerce Way, Atlanta, GA",
    lastOrder: "2025-04-22",
    description: "",
    location: "",
  },
];

const typeColors: Record<ClientType, string> = {
  [ClientType.ALL_CLIENTS]: "bg-gray-100",
  [ClientType.ONLINE]: "bg-green-500",
  [ClientType.IN_PERSON]: "bg-blue-500",
};

const typeBackgroundColors: Record<ClientType, string> = {
  [ClientType.ALL_CLIENTS]: "",
  [ClientType.ONLINE]: "bg-green-50",
  [ClientType.IN_PERSON]: "bg-blue-50",
};

const typeDisplayNames: Record<ClientType, string> = {
  [ClientType.ALL_CLIENTS]: "All Clients",
  [ClientType.ONLINE]: "Individual",
  [ClientType.IN_PERSON]: "Company",
};

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Load dummy data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setClients(dummyClients);
      setSuppliers(dummySuppliers);
      setLoading(false);
    };
    loadData();
  }, []);

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * window.innerWidth * 0.9,
        behavior: "smooth",
      });
    }
  };

  const handleCloseAddModal = () => {
    setShowAddClientModal(false);
  };

  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const left = el.scrollLeft;
      if ((left <= 20 && !isRight) || (left >= max - 20 && isRight)) return;
      el.scrollTo({ left: left + (isRight ? 50 : -50), behavior: "smooth" });
      moveMainList(isRight);
    }, 100);
  };

  // Handle client type change when dragging between columns
  const handleClientTypeChange = (clientId: string, newType: ClientType) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, type: newType } : c))
    );
    console.log(`Changed client ${clientId} to type ${newType}`);
  };

  const getClientsByType = (type: ClientType): Client[] => {
    let filteredClients = clients.filter(
      (client) =>
        searchQuery === "" ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );

    if (type === ClientType.ALL_CLIENTS) return filteredClients;
    return filteredClients.filter((client) => client.type === type);
  };

  // Filter & sort logic for clients
  useEffect(() => {
    let items = [...clients];
    switch (selectedFilterOption) {
      case "Newest first":
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
    setClients(items);
  }, [selectedFilterOption]);

  // Define the customer type tabs correctly
  const customerTypeTabs = [
    ClientType.ALL_CLIENTS,
    ClientType.ONLINE,
    ClientType.IN_PERSON,
  ];

  return (
    <DndProvider backend={HTML5Backend}>
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
          <CustomTabBarWidget
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scrollToSection={scrollToSection}
            proprimaryColor="#000"
            backgroundColor={["#6b7280", "#000", "#22c55e", "#3b82f6"]}
            listofitems={customerTypeTabs}
            itemToString={(type) =>
              `${typeDisplayNames[type]} (${
                type === ClientType.ALL_CLIENTS
                  ? clients.length
                  : getClientsByType(type).length
              })`
            }
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
                Add your customer to get started
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden w-full sm:container px-4 sm:px-0"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {customerTypeTabs.map((type) => (
                <StatusColumn
                  key={type}
                  status={type}
                  clients={getClientsByType(type)}
                  allClients={clients}
                  onTypeChange={handleClientTypeChange}
                  onDrag={moveMainList}
                  showSearchBar={showSearchBar}
                  setShowSearchBar={setShowSearchBar}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              ))}

              {/* Suppliers Column */}
              <div className="flex-shrink-0 w-11/12 sm:w-80 bg-white rounded-xl border mr-4 p-4">
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
                  {suppliers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No suppliers found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {suppliers.map((supplier) => (
                        <SupplierWidget
                          key={supplier.id}
                          supplier={supplier}
                          status={""}
                          onChangeSuppliersStatus={function (
                            status: string
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                          onTap={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {isMobile ? (
          <BottomSheet
            open={showAddClientModal}
            onDismiss={handleCloseAddModal}
            style={{
              zIndex: theme.zIndex.modal,
            }}
          >
            <Box
              sx={{
                maxHeight: "90vh",
                overflowY: "auto",
                minHeight: "80vh",
                padding: 2,
              }}
            >
              <AddClientModal onClose={handleCloseAddModal} />
            </Box>
          </BottomSheet>
        ) : (
          <Modal open={showAddClientModal} onClose={handleCloseAddModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <AddClientModal onClose={handleCloseAddModal} />
            </Box>
          </Modal>
        )}

        {/* Supplier Modals (unchanged) */}
        <Modal
          open={showAddSupplierModal}
          onClose={() => setShowAddSupplierModal(false)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Supplier</h2>
            {/* ... existing supplier modal content ... */}
          </div>
        </Modal>

        <Modal
          open={showImportSupplierModal}
          onClose={() => setShowImportSupplierModal(false)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Import Supplier</h2>
            {/* ... existing import modal content ... */}
          </div>
        </Modal>
      </div>
    </DndProvider>
  );
};

const StatusColumn = ({
  status,
  clients,
  allClients,
  onTypeChange,
  onDrag,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
}: {
  status: ClientType;
  clients: Client[];
  allClients: Client[];
  onTypeChange: (id: string, newType: ClientType) => void;
  onDrag: (isRight: boolean) => void;
  showSearchBar: boolean;
  setShowSearchBar: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div
      className="flex-shrink-0 w-11/12 sm:w-80 bg-white rounded-xl border mr-4 p-4"
      style={{ scrollSnapAlign: "center" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {status !== ClientType.ALL_CLIENTS && (
            <div
              className={`w-2 h-2 rounded-full ${typeColors[status]} mr-2`}
            ></div>
          )}
          <h3 className="text-sm font-bold text-gray-900">
            {typeDisplayNames[status]} ({clients.length})
          </h3>
        </div>

        {status === ClientType.ALL_CLIENTS && (
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

      {status === ClientType.ALL_CLIENTS ? (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientWidget
                key={client.id}
                client={client}
                bgColor={typeBackgroundColors[client.type] || ""}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No clients found matching your search
            </div>
          )}
        </div>
      ) : (
        <DropColumn
          status={status}
          clients={clients}
          onTypeChange={onTypeChange}
          onDrag={onDrag}
        />
      )}
    </div>
  );
};

const DropColumn = ({
  status,
  clients,
  onTypeChange,
  onDrag,
}: {
  status: ClientType;
  clients: Client[];
  onTypeChange: (id: string, newType: ClientType) => void;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "client",
    drop: (item: { client: Client }) => {
      onTypeChange(item.client.id, status);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`overflow-y-auto rounded-lg ${isOver ? "bg-gray-100" : ""}`}
      style={{ maxHeight: "calc(100vh - 250px)", minHeight: "100px" }}
    >
      {clients.length > 0 ? (
        clients.map((client) => (
          <DraggableClient key={client.id} client={client} onDrag={onDrag} />
        ))
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
          Drag clients here
        </div>
      )}
    </div>
  );
};

const DraggableClient = ({
  client,
  onDrag,
}: {
  client: Client;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "client",
    item: { client },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const screenWidth = window.innerWidth;
    if (e.clientX > screenWidth * 0.8) {
      onDrag(true);
    } else if (e.clientX < screenWidth * 0.2) {
      onDrag(false);
    }
  };

  return (
    <div
      ref={drag}
      draggable
      onDrag={handleDrag}
      className={`mb-3 ${isDragging ? "opacity-30" : "opacity-100"}`}
    >
      <ClientWidget
        client={client}
        bgColor={typeBackgroundColors[client.type] || ""}
      />
    </div>
  );
};

export default Customers;
