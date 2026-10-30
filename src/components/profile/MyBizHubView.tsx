'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Store,
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  Plus,
  Package,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  Inbox,
  RefreshCw,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  Filter,
  DollarSign,
  ArrowUpRight,
  Check,
  X,
  CreditCard,
  ShoppingBasket,
  SlidersHorizontal,
} from 'lucide-react';
import {
  shopService,
  Shop,
  ShopStatistics,
  ShopOrdersSummary,
  ShopOrderItem,
  ShopClient,
  ShopGraphData,
} from '../../services/shopService';
import { formatThousands, formatCurrency } from '../../common/functions/formatThousands';
import SellOptionsModal from '../marketplace/SellOptionsModal';

interface MyBizHubViewProps {
  userId: string;
  isPro?: boolean;
}

type DateFilterOption = 'all_time' | 'today' | 'last_7_days' | 'last_30_days';

export default function MyBizHubView({ userId, isPro }: MyBizHubViewProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [shop, setShop] = useState<Shop | null>(null);

  // Date Filter matching mobile shopController.filterData()
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all_time');
  const [dateFilterOpen, setDateFilterOpen] = useState<boolean>(false);

  // Statistics & Graph
  const [stats, setStats] = useState<ShopStatistics>({
    views: 0,
    clientCount: 0,
    projectCount: 0,
    totalExpenses: 0,
    totalAmount: 0,
  });
  const [orderSummary, setOrderSummary] = useState<ShopOrdersSummary>({
    pending: 0,
    paid: 0,
    cancelled: 0,
    completed: 0,
    processed: 0,
    online: 0,
    in_person: 0,
    pickup: 0,
    totalOrders: 0,
  });
  const [graphData, setGraphData] = useState<ShopGraphData>({
    totalSales: 0,
    xAxis: 'day',
    graphData: [],
  });

  // Hub Sub-tabs: 'overview' | 'inventory' | 'orders' | 'clients'
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'inventory' | 'orders' | 'clients'>('overview');

  // Inventory items
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [inventoryTab, setInventoryTab] = useState<'products' | 'services'>('products');

  // Orders: Dual-Mode matching Mobile (Sales Leads received vs My Purchases placed)
  const [orderSection, setOrderSection] = useState<'sales' | 'purchases'>('sales');
  const [salesOrders, setSalesOrders] = useState<ShopOrderItem[]>([]);
  const [purchasedOrders, setPurchasedOrders] = useState<ShopOrderItem[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'paid' | 'completed' | 'cancelled'>('all');

  // Clients list
  const [clients, setClients] = useState<ShopClient[]>([]);

  // Modal control
  const [sellModalOpen, setSellModalOpen] = useState<boolean>(false);
  const [sellModalTab, setSellModalTab] = useState<0 | 1>(0);

  const loadBizData = useCallback(async (selectedFilter: DateFilterOption = 'all_time') => {
    if (!userId) return;
    try {
      const userShop = await shopService.getUserShop(userId);
      setShop(userShop);

      const [statData, prodData, servData, myOrdersData] = await Promise.all([
        shopService.getShopStatistics(userId),
        shopService.getUserProducts(userId),
        shopService.getUserServices(userId),
        shopService.getUserOrders(userId),
      ]);
      setStats(statData);
      setProducts(prodData);
      setServices(servData);
      setPurchasedOrders(myOrdersData);

      if (userShop?.id) {
        const filterParam = selectedFilter === 'all_time' ? undefined : selectedFilter;
        const [ordersSum, ordersList, clientsList, graphRes] = await Promise.all([
          shopService.getShopOrdersSummary(userShop.id, filterParam),
          shopService.getShopOrders(userShop.id),
          shopService.getShopClients(userShop.id),
          shopService.getShopGraphData(userShop.id, filterParam),
        ]);
        setOrderSummary(ordersSum);
        setSalesOrders(ordersList);
        setClients(clientsList);
        setGraphData(graphRes);
      }
    } catch (e) {
      console.error('Failed to load My Biz data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadBizData(dateFilter);
  }, [loadBizData, dateFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBizData(dateFilter);
  };

  const handleDateFilterChange = (filter: DateFilterOption) => {
    setDateFilter(filter);
    setDateFilterOpen(false);
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    const ok = await shopService.deleteProduct(id);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDeleteService = async (id: string | number) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    const ok = await shopService.deleteService(id);
    if (ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: string) => {
    const ok = await shopService.updateOrderStatus(orderId, newStatus);
    if (ok) {
      setSalesOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      if (shop?.id) {
        const sum = await shopService.getShopOrdersSummary(
          shop.id,
          dateFilter === 'all_time' ? undefined : dateFilter
        );
        setOrderSummary(sum);
      }
    }
  };

  const activeOrdersList = orderSection === 'sales' ? salesOrders : purchasedOrders;

  const filteredOrders = useMemo(() => {
    return activeOrdersList.filter((o) => {
      if (orderStatusFilter === 'all') return true;
      return o.status?.toLowerCase() === orderStatusFilter;
    });
  }, [activeOrdersList, orderStatusFilter]);

  // Breakdown calculation for SVG Pie Chart
  const pieSlices = useMemo(() => {
    const total = orderSummary.totalOrders || 0;
    if (total === 0) return [];

    const segments = [
      { key: 'paid', label: 'Paid', count: orderSummary.paid || 0, color: '#10B981' },
      { key: 'pending', label: 'Pending', count: orderSummary.pending || 0, color: '#F59E0B' },
      { key: 'completed', label: 'Completed', count: orderSummary.completed || 0, color: '#3B82F6' },
      { key: 'cancelled', label: 'Cancelled', count: orderSummary.cancelled || 0, color: '#EF4444' },
    ].filter((s) => s.count > 0);

    let cumulativePercent = 0;
    return segments.map((slice) => {
      const percent = (slice.count / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return {
        ...slice,
        percent,
        startPercent,
        endPercent: cumulativePercent,
      };
    });
  }, [orderSummary]);

  const currencySymbol = shop?.currency || 'USD';

  const filterLabel = {
    all_time: 'All Time',
    today: 'Today',
    last_7_days: 'Last 7 Days',
    last_30_days: 'Last 30 Days',
  }[dateFilter];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs flex flex-col items-center justify-center py-20 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#F21C29] mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading My Biz...</p>
        <p className="text-xs text-slate-400 mt-1">Syncing store catalog, metrics, and incoming leads</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* SHOP HEADER & ACTIONS BANNER                                   */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center font-black text-xl shrink-0 overflow-hidden border border-slate-200 shadow-2xs">
              {shop?.image ? (
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-7 h-7 text-[#F21C29]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {shop?.name || 'My Biz'}
                </h2>
                {shop?.verificationStatus === 'approved' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Store
                  </span>
                ) : shop?.verificationStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    Verification Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    <AlertCircle className="w-3 h-3" />
                    Standard Biz
                  </span>
                )}
                {isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                {shop?.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {shop.location}
                  </span>
                )}
                <span>•</span>
                <span>Active Currency: {currencySymbol}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            {/* Mobile Date Filter Parity Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDateFilterOpen(!dateFilterOpen)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Filter className="w-3.5 h-3.5 text-[#F21C29]" />
                <span>{filterLabel}</span>
              </button>
              {dateFilterOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-20">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Filter Data By
                  </div>
                  {(['today', 'last_7_days', 'last_30_days', 'all_time'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleDateFilterChange(opt)}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        dateFilter === opt ? 'text-[#F21C29] bg-red-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span>
                        {opt === 'today'
                          ? 'Today'
                          : opt === 'last_7_days'
                          ? 'Last 7 Days'
                          : opt === 'last_30_days'
                          ? 'Last 30 Days'
                          : 'All Time'}
                      </span>
                      {dateFilter === opt && <Check className="w-3.5 h-3.5 text-[#F21C29]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                setSellModalTab(0);
                setSellModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#D01420] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Listing</span>
            </button>
            <Link
              href="/subscription"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isPro ? 'Pro Active' : 'Upgrade Pro'}</span>
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUB-NAVIGATION TABS                                            */}
        {/* ============================================================== */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeSubTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory & Services ({products.length + services.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeSubTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Leads & Orders ({salesOrders.length + purchasedOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('clients')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeSubTab === 'clients'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers ({clients.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW & DASHBOARD METRICS                            */}
      {/* ============================================================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 4-Tile High-Impact Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  $
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatCurrency(graphData.totalSales || stats.totalAmount, currencySymbol)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Recorded revenue ({filterLabel})</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatThousands(orderSummary.totalOrders)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {orderSummary.pending} pending · {orderSummary.paid} paid
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clients</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatThousands(stats.clientCount || clients.length)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Active customer CRM</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Store Visits</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatThousands(stats.views || shop?.views || 0)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Catalog views</p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MOBILE PARITY: LEADS BREAKDOWN & FINANCIAL PROJECTION WIDGETS  */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Leads Breakdown (Pie Chart Representation) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-[#F21C29]" />
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Leads <span className="text-slate-400 font-normal">— Breakdown</span>
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderSection('sales');
                      setActiveSubTab('orders');
                    }}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>View All Leads</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orderSummary.totalOrders === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <p className="text-xs font-bold">No order leads recorded yet for this timeframe</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Share your Biz link to start receiving client orders</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                    {/* SVG Pie Chart */}
                    <div className="relative w-36 h-36 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {pieSlices.map((slice) => {
                          const strokeDasharray = `${slice.percent} ${100 - slice.percent}`;
                          const strokeDashoffset = -slice.startPercent;
                          return (
                            <circle
                              key={slice.key}
                              cx="18"
                              cy="18"
                              r="15.915"
                              fill="transparent"
                              stroke={slice.color}
                              strokeWidth="4"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-500"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-slate-900">{orderSummary.totalOrders}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Leads</span>
                      </div>
                    </div>

                    {/* Breakdown Legend */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-bold text-slate-600">Paid Leads</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderSummary.paid}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-[11px] font-bold text-slate-600">Pending</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderSummary.pending}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-[11px] font-bold text-slate-600">Completed</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderSummary.completed || 0}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-50/50 border border-red-100">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-[11px] font-bold text-slate-600">Cancelled</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderSummary.cancelled}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery method breakdown footer */}
              {(orderSummary.online || orderSummary.in_person || orderSummary.pickup) ? (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Delivery Channels:</span>
                  <div className="flex items-center gap-3">
                    {orderSummary.online ? <span>Online: {orderSummary.online}</span> : null}
                    {orderSummary.in_person ? <span>In-person: {orderSummary.in_person}</span> : null}
                    {orderSummary.pickup ? <span>Pickup: {orderSummary.pickup}</span> : null}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Financial Projection Table & Sales Activity */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Financial Projection
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {filterLabel}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50 text-xs font-extrabold text-slate-700 py-2.5 px-4">
                    <span>Leads Metric</span>
                    <span className="text-right">Projected Value</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="grid grid-cols-2 py-3 px-4 items-center">
                      <span className="font-bold text-slate-900">Leads from All Orders</span>
                      <span className="text-right font-black text-emerald-700 text-sm">
                        {formatCurrency(graphData.totalSales || stats.totalAmount, currencySymbol)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 py-3 px-4 items-center bg-slate-50/40">
                      <span className="text-slate-600">Average Order Size</span>
                      <span className="text-right font-bold text-slate-900">
                        {orderSummary.totalOrders > 0
                          ? formatCurrency(
                              (graphData.totalSales || stats.totalAmount) / orderSummary.totalOrders,
                              currencySymbol
                            )
                          : formatCurrency(0, currencySymbol)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 py-3 px-4 items-center">
                      <span className="text-slate-600">Tracked Expenses</span>
                      <span className="text-right font-bold text-slate-500">
                        {formatCurrency(stats.totalExpenses, currencySymbol)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Graph Points if available */}
                {graphData.graphData.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                      Recent Performance Timeline
                    </span>
                    <div className="flex items-end gap-1.5 h-16 w-full pt-2">
                      {graphData.graphData.slice(-10).map((pt, i) => {
                        const maxVal = Math.max(...graphData.graphData.map((g) => g.totalAmount), 1);
                        const heightPct = Math.max(10, Math.min(100, (pt.totalAmount / maxVal) * 100));
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full rounded-t-sm bg-gradient-to-t from-red-600 to-[#F21C29] group-hover:from-emerald-600 group-hover:to-emerald-500 transition-colors"
                            />
                            <span className="text-[9px] text-slate-400 font-bold truncate max-w-[28px]">
                              {pt.date.slice(-5)}
                            </span>
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                              {formatCurrency(pt.totalAmount, currencySymbol)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Short-cuts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => {
                setSellModalTab(0);
                setSellModalOpen(true);
              }}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-red-300 hover:bg-red-50/20 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Add New Product</h4>
              <p className="text-xs text-slate-500 mt-1">
                Showcase physical or digital products in Biz Centre & Marketplace.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSellModalTab(1);
                setSellModalOpen(true);
              }}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/20 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Add Bookable Service</h4>
              <p className="text-xs text-slate-500 mt-1">
                Offer consulting, hourly sessions, or custom client packages.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('orders')}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-emerald-50/20 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Manage Orders & Leads</h4>
              <p className="text-xs text-slate-500 mt-1">
                Fulfill incoming orders, update status, and manage client transactions.
              </p>
            </button>
          </div>

          {/* Verification Banner if not verified */}
          {shop?.verificationStatus !== 'approved' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-red-200 text-[#F21C29] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    {shop?.verificationStatus === 'pending'
                      ? 'Verification Under Review'
                      : 'Get Your Verified Biz Badge'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {shop?.verificationStatus === 'pending'
                      ? 'Our team is reviewing your documents. Verification typically takes 24-48 hours.'
                      : 'Verified businesses get priority ranking in searches and build trust with buyers.'}
                  </p>
                </div>
              </div>
              <Link
                href="/profile/settings"
                className="px-4 py-2 rounded-xl bg-[#F21C29] text-white font-bold text-xs hover:bg-[#D01420] transition-colors shrink-0 text-center"
              >
                {shop?.verificationStatus === 'pending' ? 'Review Details' : 'Verify Biz'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: INVENTORY & SERVICES                                    */}
      {/* ============================================================== */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl border border-slate-200/80 p-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInventoryTab('products')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inventoryTab === 'products'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Products ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setInventoryTab('services')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  inventoryTab === 'services'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Services ({services.length})
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSellModalTab(inventoryTab === 'products' ? 0 : 1);
                setSellModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#F21C29] text-white text-xs font-bold hover:bg-[#D01420] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add {inventoryTab === 'products' ? 'Product' : 'Service'}</span>
            </button>
          </div>

          {inventoryTab === 'products' ? (
            products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
                <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No products added yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Add products to sell directly to other members in the marketplace and through your store link.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSellModalTab(0);
                    setSellModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#F21C29] text-white text-xs font-bold hover:bg-[#D01420] transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => {
                  const image = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                          {image ? (
                            <img src={image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                            Qty: {p.quantity || 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {p.description || 'No description provided'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-slate-900 text-base">
                          {formatCurrency(p.price, p.currency || currencySymbol)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : services.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
              <Wrench className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No services added yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Offer your expertise, consulting, design, or specialized trade services to buyers.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSellModalTab(1);
                  setSellModalOpen(true);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#F21C29] text-white text-xs font-bold hover:bg-[#D01420] transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Service</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => {
                const image = Array.isArray(s.images) && s.images.length > 0 ? s.images[0] : s.image;
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                        {image ? (
                          <img src={image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Wrench className="w-8 h-8" />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold">
                          Service
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{s.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {s.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-base">
                        {formatCurrency(s.price, s.currency || currencySymbol)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LEADS & ORDERS (DUAL TAB: SALES LEADS VS MY ORDERS)      */}
      {/* ============================================================== */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {/* Main Dual Selector: Sales Leads received vs My Purchases placed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-2.5 flex items-center justify-between flex-wrap gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderSection('sales')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderSection === 'sales'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Sales Leads ({salesOrders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderSection('purchases')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  orderSection === 'purchases'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBasket className="w-3.5 h-3.5" />
                <span>My Orders ({purchasedOrders.length})</span>
              </button>
            </div>

            {/* Status Pills Filter */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'paid', 'completed', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setOrderStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                    orderStatusFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">
                No {orderStatusFilter !== 'all' ? orderStatusFilter : ''}{' '}
                {orderSection === 'sales' ? 'sales leads' : 'purchased orders'} found
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {orderSection === 'sales'
                  ? 'Orders placed by customers on your store listings will appear here.'
                  : 'Items and services you have ordered across the marketplace will be tracked here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const partnerName =
                  orderSection === 'sales'
                    ? order.client?.name || order.user?.name || 'Customer'
                    : 'Store Seller';
                const statusColor =
                  order.status === 'paid' || order.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : order.status === 'cancelled'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-bold text-sm">
                        {partnerName.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-sm">{partnerName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColor}`}
                          >
                            {order.status || 'Pending'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {orderSection === 'sales' ? 'Customer Lead' : 'Your Purchase'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Order #{String(order.id).slice(-6)} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                        {Array.isArray(order.items) && order.items.length > 0 && (
                          <p className="text-xs text-slate-600 mt-1 font-medium">
                            Items: {order.items.map((i) => i.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <span className="text-base font-black text-slate-900">
                        {formatCurrency(order.totalAmount || order.amount || 0, currencySymbol)}
                      </span>
                      {orderSection === 'sales' && order.status !== 'paid' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Mark Paid
                          </button>
                          {order.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CLIENTS CRM                                             */}
      {/* ============================================================== */}
      {activeSubTab === 'clients' && (
        <div className="space-y-4">
          {clients.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No client records yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Clients who book services or place orders through your store will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700 shrink-0">
                      {c.name ? c.name.slice(0, 1).toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{c.name}</h4>
                      {c.company && (
                        <p className="text-xs text-slate-500 truncate">{c.company}</p>
                      )}
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        {c.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Orders</span>
                    <span className="font-black text-slate-900">{c.totalOrders || 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SELL OPTIONS MODAL (PRODUCT / SERVICE CREATION)                 */}
      {/* ============================================================== */}
      <SellOptionsModal
        isOpen={sellModalOpen}
        initialTab={sellModalTab}
        onClose={() => setSellModalOpen(false)}
        onSuccess={() => {
          loadBizData(dateFilter);
        }}
      />
    </div>
  );
}
