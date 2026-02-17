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
import SupplierWidget from "../components/supplierwidget";
import ShopController from "../../biz-center/controllers/ShopController";
import { useAppSelector } from "../../../../redux/store/store";

interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  lastOrder: string;
  description: string;
  location: string;
}

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
  const shop = useAppSelector((state) => state.shop.shopInfo);

  // Load dummy data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const clientsFromApi = await ShopController.initClients(shop!.userId);
        const parsedClients = clientsFromApi.clients.map((client) => ({
          ...client,
          createdAt: new Date(client.createdAt),
        }));

        setClients(parsedClients);
        setSuppliers(dummySuppliers);
      } catch (error) {
        console.error("Failed to load clients:", error);
      }
      setLoading(false);
    };
    loadData();
  }, [shop]);

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

  const handleSaveClient = (newClient: Client) => {
    setClients((prev) => {
      const index = prev.findIndex((c) => c.id === newClient.id);
      if (index !== -1) {
        // Update existing client
        const updated = [...prev];
        updated[index] = newClient;
        return updated;
      } else {
        // Add new client
        return [newClient, ...prev];
      }
    });
    setShowAddClientModal(false);
  };

  const handleSaveSupplier = (newSupplier: Supplier) => {
    setSuppliers((prev) => {
      const index = prev.findIndex((s) => s.id === newSupplier.id);
      if (index !== -1) {
        // Update existing supplier
        const updated = [...prev];
        updated[index] = newSupplier;
        return updated;
      } else {
        // Add new supplier
        return [newSupplier, ...prev];
      }
    });
    setShowAddSupplierModal(false);
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
            proprimaryColor="#1F2937"
            backgroundColor={["#6b7280", "#D3FFE3", "#B0D9FB", "#FBD4FF"]}
            listofitems={[...customerTypeTabs, "SUPPLIER"]}
            itemToString={(type) => {
              if (type === "SUPPLIER") {
                return `Suppliers (${suppliers.length})`;
              }

              const clientType = type as ClientType;
              return `${
                clientType in typeDisplayNames
                  ? typeDisplayNames[clientType]
                  : clientType
              } (${
                clientType === ClientType.ALL_CLIENTS
                  ? clients.length
                  : getClientsByType(clientType).length
              })`;
            }}
            filterOptions={["Newest first", "None"]}
            onFilterSelected={(opt) => opt && setSelectedFilterOption(opt)}
          />

          {loading ? (
            <div className="h-64 flex justify-center items-center">
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
                  setSearchQuery={setSearchQuery} onEditClient={function (client: Client): void {
                    throw new Error("Function not implemented.");
                  } }                />
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
              {/* Pass save function to modal */}
              <AddClientModal
                onClose={handleCloseAddModal}
                onSave={handleSaveClient}
              />
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
              <AddClientModal
                onClose={handleCloseAddModal}
                onSave={handleSaveClient}
              />
            </Box>
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};

interface StatusColumnProps {
  status: ClientType;
  clients: Client[];
  allClients: Client[];
  onTypeChange: (clientId: string, newType: ClientType) => void;
  onDrag: (isRight: boolean) => void;
  showSearchBar: boolean;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onEditClient: (client: Client) => void; 
}

const StatusColumn: React.FC<StatusColumnProps> = ({
  status,
  clients,
  allClients,
  onTypeChange,
  onDrag,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
  onEditClient,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "client",
    drop: (item: Client) => {
      if (item.type !== status) onTypeChange(item.id, status);
    },
    canDrop: (item: Client) => item.type !== status,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-11/12 sm:w-80 rounded-xl border p-4 mr-4 cursor-pointer
        ${typeBackgroundColors[status]} 
        ${isOver && canDrop ? "border-4 border-green-400" : "border-gray-200"}`}
    >
      <div className="flex items-center mb-3">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${typeColors[status]}`}
        ></div>
        <h3 className="text-sm font-bold text-gray-900">
          {typeDisplayNames[status]} ({clients.length})
        </h3>
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients"
            className="w-full px-2 py-1 rounded border border-gray-300"
          />
          <button onClick={() => setShowSearchBar(false)} className="text-gray-600">
            <FiX />
          </button>
        </div>
      )}

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {clients.length === 0 ? (
          <p className="text-sm text-gray-500">No clients</p>
        ) : (
          clients.map((client) => (
            <ClientWidget key={client.id} client={client} bgColor={""} onEdit={() => onEditClient(client)}/>
          ))
        )}
      </div>
    </div>
  );
};

export default Customers;
