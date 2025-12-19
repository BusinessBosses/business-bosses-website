import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiSearch, FiX, FiPlusSquare } from "react-icons/fi";
import CustomTabBarWidget from "../tasks/components/customtabbar";
import Spinner from "../tasks/components/spinner";
import CreateOrderModal from "./components/ordermodal";
import OrderWidget from "./components/orderwidget";
import { Order, OrderStatus } from "./model/order";
import { Client } from "../customers/models/client";
import ProCustomButton from "../biz-center/components/procustombutton";
import ShopController from "../biz-center/controllers/ShopController";
import { useAppSelector } from "../../../redux/store/store";

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

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // raw + filtered lists
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // grouped by status
  const [statusOrders, setStatusOrders] = useState<Record<OrderStatus, Order[]>>({
    [OrderStatus.ALL_ORDERS]: [],
    [OrderStatus.PENDING]: [],
    [OrderStatus.PAID]: [],
    [OrderStatus.COMPLETED]: [],
  });


  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shop = useAppSelector((state) => state.shop.shopInfo);

  const fetchOrders = async () => {
    if (!shop?.id) return;
    setLoading(true);
    try {
      const {
        orders: fetched,
        statusOrders: buckets,
        allOrders: flatList,
      } = await ShopController.initOrders(shop.id);

      setOrders(fetched);
      setFilteredOrders(fetched);
      setStatusOrders(buckets);
      setAllOrders(flatList);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    if (!shop?.id) return;
    setLoading(true);
    try {
      const {
        allClients: flatList,
      } = await ShopController.initClients(shop.user!.uid);

      setAllClients(flatList);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    if (!shop?.id) return;
    setLoading(true);
    try {
      const responseProducts = await ShopController.fetchProducts(shop.user!.uid);
      const responseServices = await ShopController.fetchServices(shop.user!.uid);
      console.log(responseProducts);
      console.log(responseServices);
      
      setProducts(responseProducts.data.rows);
      setServices(responseServices.data.rows);
    } catch (err) {
      console.error("Failed to load products/services:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1️⃣ Fetch & group on mount (or when shop changes)
  useEffect(() => {
    fetchOrders();
    fetchClients();
    fetchItems();
  }, []);
  
  // 2️⃣ Apply search only on “All Orders”
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredOrders(
        orders.filter((o) => o.client?.name.toLowerCase().includes(q))
      );
    }
  }, [searchQuery, orders]);

  // 3️⃣ Build the render‐time buckets: use search on ALL, controller buckets on others
  const statusOrdersToRender: Record<OrderStatus, Order[]> = {
    [OrderStatus.ALL_ORDERS]: filteredOrders,
    [OrderStatus.PENDING]: statusOrders[OrderStatus.PENDING],
    [OrderStatus.PAID]: statusOrders[OrderStatus.PAID],
    [OrderStatus.COMPLETED]: statusOrders[OrderStatus.COMPLETED],
  };

  // helpers for scrolling tabs
  const scrollToSection = (index: number) => {
    if (!scrollContainerRef.current) return;
    const left = index * window.innerWidth * 0.9;
    scrollContainerRef.current.scrollTo({ left, behavior: "smooth" });
  };
  const moveMainList = (isRight: boolean) => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const cur = el.scrollLeft;
      const max = el.scrollWidth - el.clientWidth;
      if ((cur <= 20 && !isRight) || (cur >= max - 20 && isRight)) return;
      el.scrollTo({ left: cur + (isRight ? 50 : -50), behavior: "smooth" });
      moveMainList(isRight);
    }, 100);
  };

  // when you drop an order into a new status column
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // mock data for CreateOrderModal

  const paymentMethods = shop?.payments?.map((p : any)=> p.paymentMethod);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white min-h-screen w-full flex flex-col rounded-2xl">
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Orders</h1>
          <ProCustomButton
            text="Create Order"
            icon={<FiPlusSquare className="h-6 w-6" />}
            onPressed={() => setShowModal(true)}
          />
        </header>

        <div className="container mx-auto px-4 flex-1 flex flex-col">
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
                  ? filteredOrders.length
                  : statusOrdersToRender[status]?.length ?? 0
              })`
            }
          />

          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <Spinner color="black" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h3 className="text-lg font-medium">No Orders Found!</h3>
              <p className="text-sm text-gray-500">
                Create your first order to get started
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 mt-4 scrollbar-hidden"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Object.values(OrderStatus).map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  orders={statusOrdersToRender[status]}
                  allOrders={allOrders}
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

        {showModal && (
          <CreateOrderModal
            onClose={() => setShowModal(false)}
            shop={shop!}
            clients={allClients}
            products={products}
            services={services}
            paymentMethods={paymentMethods}
            onCreateOrder={async (orderData) => {
              setLoading(true);
              setShowModal(false);
              await ShopController.addOrder(orderData);
              fetchOrders(); // Re-fetch orders after creating a new one
              return true;
            }}
            onUpdateOrder={async (orderId, orderData) => {
              // …your existing update logic…
              return true;
            }}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Orders;

// ----------------------
// StatusColumn & Draggable
// ----------------------

const StatusColumn: React.FC<{
  status: OrderStatus;
  orders: Order[];
  allOrders: Order[];
  onStatusChange(id: string, s: OrderStatus): void;
  onDrag(isRight: boolean): void;
  showSearchBar: boolean;
  setShowSearchBar(show: boolean): void;
  searchQuery: string;
  setSearchQuery(q: string): void;
}> = ({
  status,
  orders,
  onStatusChange,
  onDrag,
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "order",
     drop: (item: { order: Order }, monitor) => {
       // only trigger on the shallowest drop target:
       if (monitor.isOver({ shallow: true })) {
         onStatusChange(item.order.id, status);
       }
     },
     collect: (monitor) => ({
       isOver: monitor.isOver({ shallow: true }),
       canDrop: monitor.canDrop(),
     }),
  });

  return (
    <div
           ref={drop}
           style={{
             backgroundColor:
               status !== OrderStatus.ALL_ORDERS && isOver
                 ? "#f3f4f6"
                 : "white",
             borderRadius: 8,
             padding: 16,
             marginRight: 16,
             minHeight: 150,
           }}
         >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {status !== OrderStatus.ALL_ORDERS && (
            <div
              className={`w-2 h-2 rounded-full ${statusColors[status]} mr-2`}
            />
          )}
          <h3 className="text-sm font-bold">{statusDisplayTitles[status]}</h3>
        </div>
        {status === OrderStatus.ALL_ORDERS && (
          showSearchBar ? (
            <div className="flex items-center">
              <input
                className="border rounded px-2 py-1 text-sm"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => { setShowSearchBar(false); setSearchQuery(""); }}>
                <FiX />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowSearchBar(true)}>
              <FiSearch />
            </button>
          )
        )}
      </div>
      <div className="border-t border-gray-200 mb-2" />
      {orders.length > 0 ? (
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh-250px)" }}>
          {orders.map((order) => (
            <DraggableOrder key={order.id} order={order} onDrag={onDrag} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          {status === OrderStatus.ALL_ORDERS
            ? "No orders found."
            : "Drag orders here"}
        </div>
      )}
    </div>
  );
};

const DraggableOrder: React.FC<{ order: Order; onDrag(isRight: boolean): void }> = ({
  order,
  onDrag,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
         type: "order",
         item: { order },
         collect: (monitor) => ({
           isDragging: monitor.isDragging(),
         }),
       }));

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const w = window.innerWidth;
    if (e.clientX > w * 0.8) onDrag(true);
    else if (e.clientX < w * 0.2) onDrag(false);
  };

  return (
    <div
       ref={drag}
       onDrag={handleDrag}            // keep your auto-scroll logic
       style={{
         opacity: isDragging ? 0.3 : 1,
         marginBottom: 12,
         cursor: "move",
       }}
     >
      <OrderWidget order={order} status={order.status} />
    </div>
  );
};
