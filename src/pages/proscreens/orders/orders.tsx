import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {  FiMessageSquare, FiX, FiSearch, FiBell, FiPlusSquare } from "react-icons/fi";
import { Modal } from "@mui/material";
import CustomTabBarWidget from "../tasks/components/customtabbar";
import Spinner from "../tasks/components/spinner";
import CreateOrderModal from "./components/ordermodal";


enum OrderStatus {
  ALL_ORDERS = "allorders",
  PENDING = "pending",
  PAID = "paid",
  COMPLETED = "completed",
}

interface Order {
  id: string;
  userId: string;
  shopId: string;
  clientId: string;
  status: OrderStatus;
  createdAt: Date;
  deliveryDate: Date;
  client?: {
    name: string;
  };
  // Add other order properties as needed
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.ALL_ORDERS]: "bg-gray-100",
  [OrderStatus.PENDING]: "bg-amber-500",
  [OrderStatus.PAID]: "bg-blue-500",
  [OrderStatus.COMPLETED]: "bg-green-500",
};

const statusDisplayTitles: Record<OrderStatus, string> = {
  [OrderStatus.ALL_ORDERS]: "All Orders",
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.PAID]: "Paid",
  [OrderStatus.COMPLETED]: "Completed",
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveRightRef = useRef<boolean | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "1",
        userId: "user1",
        shopId: "shop1",
        clientId: "client1",
        status: OrderStatus.PENDING,
        createdAt: new Date(2023, 5, 15),
        deliveryDate: new Date(2023, 6, 30),
        client: { name: "Client A" },
      },
      {
        id: "2",
        userId: "user1",
        shopId: "shop1",
        clientId: "client2",
        status: OrderStatus.PAID,
        createdAt: new Date(2023, 4, 10),
        deliveryDate: new Date(2023, 7, 15),
        client: { name: "Client B" },
      },
      {
        id: "3",
        userId: "user1",
        shopId: "shop1",
        clientId: "client3",
        status: OrderStatus.COMPLETED,
        createdAt: new Date(2023, 3, 1),
        deliveryDate: new Date(2023, 5, 5),
        client: { name: "Client C" },
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollAmount = index * window.innerWidth * 0.9;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const currentScroll = scrollContainerRef.current.scrollLeft;
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;

      if (
        (currentScroll <= 20 && !isRight) ||
        (currentScroll >= maxScroll - 20 && isRight)
      ) {
        return;
      }

      scrollContainerRef.current.scrollTo({
        left: currentScroll + (isRight ? 50 : -50),
        behavior: "smooth",
      });

      moveMainList(isRight);
    }, 100);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const statusOrders = {
    [OrderStatus.ALL_ORDERS]: filteredOrders,
    [OrderStatus.PENDING]: filteredOrders.filter(
      (o) => o.status === OrderStatus.PENDING
    ),
    [OrderStatus.PAID]: filteredOrders.filter(
      (o) => o.status === OrderStatus.PAID
    ),
    [OrderStatus.COMPLETED]: filteredOrders.filter(
      (o) => o.status === OrderStatus.COMPLETED
    ),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-50 min-h-screen w-full flex flex-col">
        {/* Header */}
        <header className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Orders</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center bg-black text-white px-4 py-2 rounded-full"
              >
                <FiPlusSquare className="h-6 w-6" />
                <span>Create Order</span>
              </button>

              <button
                onClick={() => {
                  /* Navigate to chat */
                }}
                className="p-2 rounded-full bg-gray-200 text-gray-700"
              >
                <FiMessageSquare className="h-5 w-5" />
              </button>

              <button className="p-2 rounded-full bg-gray-200 text-gray-700 relative">
                <FiBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 flex flex-col flex-1">
          <CustomTabBarWidget<OrderStatus>
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scrollToSection={scrollToSection}
            proprimaryColor="#000000"
            backgroundColor={["#6b7280", "#000000", "#f59e0b", "#10b981"]}
            listofitems={Object.values(OrderStatus)}
            itemToString={(status) =>
              `${statusDisplayTitles[status]} (${
                status === OrderStatus.ALL_ORDERS
                  ? orders.length
                  : statusOrders[status].length
              })`
            }
          />

          {loading ? (
            <div className="h-64 pt-52">
              <Spinner color="black" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg ">
              <h3 className="text-lg font-medium text-gray-900">
                No Orders Found!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first order to get started
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden w-full"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Object.values(OrderStatus).map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  orders={
                    status === OrderStatus.ALL_ORDERS
                      ? filteredOrders
                      : statusOrders[status]
                  }
                  allOrders={filteredOrders}
                  onStatusChange={handleStatusChange}
                  onDrag={moveMainList}
                  showSearchBar={showSearchBar}
                  setShowSearchBar={setShowSearchBar}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Order Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <CreateOrderModal onClose={() => setShowModal(false)} open={false} shop={{ id: "shop1", name: "Shop 1" }} clients={[]} products={[]} services={[]} paymentMethods={[]} onCreateOrder={function (orderData: any): Promise<boolean> {
            throw new Error("Function not implemented.");
          } } onUpdateOrder={function (orderId: string, orderData: any): Promise<boolean> {
            throw new Error("Function not implemented.");
          } } />
        </Modal>
      </div>
    </DndProvider>
  );
};

const StatusColumn = ({
  status,
  orders,
  allOrders,
  onStatusChange,
  onDrag,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
}: {
  status: OrderStatus;
  orders: Order[];
  allOrders: Order[];
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
  onDrag: (isRight: boolean) => void;
  showSearchBar: boolean;
  setShowSearchBar: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div
      className="flex-shrink-0 w-11/12 sm:w-96 bg-white rounded-xl border mr-4 p-4"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {status !== OrderStatus.ALL_ORDERS && (
            <div
              className={`w-2 h-2 rounded-full ${statusColors[status]} mr-2`}
            ></div>
          )}
          <h3 className="text-sm font-bold text-gray-900">
            {statusDisplayTitles[status]}
          </h3>
        </div>

        {status === OrderStatus.ALL_ORDERS && (
          <div className="flex items-center">
            {showSearchBar ? (
              <div className="flex items-center">
                <input
                  type="text"
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  placeholder="Search orders..."
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

      {status === OrderStatus.ALL_ORDERS ? (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {orders.length > 0 ? (
            orders.map((order) => <OrderWidget key={order.id} order={order} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found matching your search
            </div>
          )}
        </div>
      ) : (
        <DropColumn
          status={status}
          orders={orders}
          onStatusChange={onStatusChange}
          onDrag={onDrag}
        />
      )}
    </div>
  );
};

const DropColumn = ({
  status,
  orders,
  onStatusChange,
  onDrag,
}: {
  status: OrderStatus;
  orders: Order[];
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "order",
    drop: (item: { order: Order }) => {
      onStatusChange(item.order.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`overflow-y-auto rounded-lg ${isOver ? "bg-gray-100" : ""}`}
      style={{ maxHeight: "calc(100vh - 250px)", minHeight: "100px" }}
    >
      {orders.length > 0 ? (
        orders.map((order) => (
          <DraggableOrder key={order.id} order={order} onDrag={onDrag} />
        ))
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
          Drag orders here
        </div>
      )}
    </div>
  );
};

const DraggableOrder = ({
  order,
  onDrag,
}: {
  order: Order;
  onDrag: (isRight: boolean) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "order",
    item: { order },
    collect: (monitor) => ({
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
      <OrderWidget order={order} />
    </div>
  );
};

export default Orders;
