'use client';

import React, { useState } from 'react';
import Image from '../common/SafeImage';
import {
  X,
  MapPin,
  Star,
  ShoppingBag,
  Briefcase,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  CreditCard,
  Building,
  Loader2,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { MarketItem } from '../../services/marketplaceService';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketItem | null;
}

export default function OrderBookingModal({ isOpen, onClose, item }: OrderModalProps) {
  if (!isOpen || !item) return null;

  const isService = item.type === 'service';
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('Pay on Delivery / Collection');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Standard Delivery');
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  const price = Number(item.price) || 0;
  const subtotal = price * quantity;
  const currency = item.currency || item.shop?.currency || '£';

  // Standard payment options matching mobile shop payment methods + Coins fallback
  const paymentOptions = [
    {
      id: 'Pay on Delivery / Collection',
      title: 'Pay on Delivery / Collection',
      subtext: 'Pay seller directly upon receipt of service/product',
      icon: Building,
    },
    {
      id: 'Direct Bank Transfer / Invoice',
      title: 'Bank Transfer / Invoice',
      subtext: 'Seller will issue payment details and verified invoice',
      icon: CreditCard,
    },
    {
      id: 'Pay with Coins',
      title: 'Pay with Coins',
      subtext: 'Escrow-held in wallet until service delivery confirmed',
      icon: Coins,
    },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authService.isAuthenticated()) {
      toast.info('Please sign in to place an order or book services');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    if (!item.shopId && !item.shop?.id) {
      toast.error('This listing does not have an active shop destination linked.');
      return;
    }

    setLoading(true);

    const payload = {
      shopId: String(item.shopId || item.shop?.id || ''),
      items: [
        {
          type: item.type,
          id: item.id,
          name: item.name,
          amount: price,
        },
      ],
      quantity: quantity,
      deliveryMethod: isService ? 'In-Person / Consultation' : deliveryMethod,
      deliveryDate: isService ? bookingDate : new Date().toISOString(),
      paymentMethod: selectedPayment,
      notes: notes.trim(),
      startTime: isService ? bookingTime : undefined,
      orderDetails: isService
        ? `Booking for ${item.name} on ${bookingDate} at ${bookingTime}`
        : `Order for ${quantity}x ${item.name}`,
    };

    const result = await orderService.createOrder(payload);

    if (result.success) {
      setSuccessOrder(result.data || { id: Date.now() });
      toast.success(isService ? 'Booking request submitted successfully!' : 'Order placed successfully!');
    } else {
      toast.error(result.error || 'Failed to complete order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#F21C29] flex items-center justify-center font-bold">
              {isService ? <Briefcase className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {isService ? 'Book Service Appointment' : 'Complete Product Order'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified Business Bosses Marketplace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {successOrder ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  {isService ? 'Booking Confirmed!' : 'Order Placed Successfully!'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your request has been routed to <strong>{item.shop?.name || 'the seller'}</strong>. You will receive invoice updates and live alerts directly in your dashboard.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl max-w-sm mx-auto text-left space-y-2 border border-slate-200/80 text-xs text-slate-700">
                <div className="flex justify-between font-bold">
                  <span>Item:</span>
                  <span className="truncate max-w-[200px]">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-slate-900">{currency}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-600">{selectedPayment}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-xs mx-auto py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Close &amp; Return to Marketplace
              </button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Item Card Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center gap-3.5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      {isService ? <Briefcase className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase text-[#F21C29] tracking-wider block">
                    {item.type}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                    <span className="font-extrabold text-slate-900">
                      {price > 0 ? `${currency}${price.toLocaleString()}` : 'Free Quote'}
                    </span>
                    {item.location && (
                      <span className="text-[10px] text-slate-400 font-semibold truncate flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Booking Date & Time vs Product Quantity */}
              {isService ? (
                <div className="space-y-3 p-4 bg-white border border-slate-200/90 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F21C29]" />
                    Appointment Schedule
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Select Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#F21C29] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Select Preferred Time
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#F21C29] transition-colors cursor-pointer"
                      >
                        <option value="09:00 AM">09:00 AM - Morning</option>
                        <option value="11:00 AM">11:00 AM - Mid Morning</option>
                        <option value="02:00 PM">02:00 PM - Afternoon</option>
                        <option value="04:00 PM">04:00 PM - Late Afternoon</option>
                        <option value="06:00 PM">06:00 PM - Evening</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-white border border-slate-200/90 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Quantity</h4>
                      <p className="text-[11px] text-slate-400">Select number of units</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-6 text-center text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Delivery Option
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#F21C29] transition-colors cursor-pointer"
                    >
                      <option value="Standard Delivery">Standard Courier Delivery</option>
                      <option value="Store Pickup">Store Collection / Self Pickup</option>
                      <option value="Digital Download">Online / Digital Delivery</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Payment Methods matching mobile options */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Payment Method
                </h4>
                <div className="space-y-2">
                  {paymentOptions.map((opt) => {
                    const isSelected = selectedPayment === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedPayment(opt.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#F21C29] bg-red-50/40 shadow-xs'
                            : 'border-slate-200/90 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#F21C29] text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {opt.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 truncate">
                              {opt.subtext}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#F21C29]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#F21C29]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Note to Seller (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions, size details, delivery notes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#F21C29] focus:bg-white transition-colors"
                />
              </div>

              {/* Total Summary Footer & Submit */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Estimated Total:</span>
                  <span className="text-lg font-black text-slate-900">
                    {price > 0 ? `${currency}${subtotal.toLocaleString()}` : 'Free Quote'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#F21C29] hover:bg-[#D01420] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 active:scale-98"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <span>{isService ? 'Confirm Booking Request' : 'Place Order Now'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
