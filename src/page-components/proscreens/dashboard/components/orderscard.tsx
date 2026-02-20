import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import Assets from "../../../../assets";


interface OrderStats {
  pending: number;
  paid: number;
  cancelled: number;
  totalOrders: number;
}

const OrdersWidget = ({ orderStats }: { orderStats: OrderStats }) => {
  const router = useRouter();

  const navigateToOrders = () => {
    // Adjust this to your routing logic
    router.push("/orders");
  };

  const data = [
    { name: "Pending", value: orderStats?.pending || 0, color: "#FFFF00" },
    { name: "Paid", value: orderStats?.paid || 0, color: "#0000FF" },
    { name: "Completed", value: orderStats?.cancelled || 0, color: "#00FF00" },
  ];

  return (
    <div
      className="p-4 bg-white rounded-2xl border-2 border-backgroundcolor cursor-pointer"
      onClick={navigateToOrders}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-base font-bold mr-1">Orders</h2>
            <span className="text-base font-semibold text-gray-600">
              - Breakdown
            </span>
          </div>

          <div
            className="flex items-center bg-blue-50 rounded-lg px-2 py-2"
            onClick={(e) => {
              e.stopPropagation();
              navigateToOrders();
            }}
          >
            <span className="text-xs font-bold text-gray-600 mr-1">
              View All Orders {orderStats?.totalOrders || 0}
            </span>
            <Assets.Nexticon className="w-2 h-2 text-gray-600" />
          </div>
        </div>

        {!orderStats || orderStats.totalOrders === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm font-semibold text-gray-400">
              No Data To Show
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="ml-2 flex flex-col">
              {data.map((item, index) => (
                <Indicator
                  key={index}
                  color={item.color}
                  text={item.name}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface IndicatorProps {
  color: string;
  text: string;
  value: number;
}

const Indicator = ({ color, text, value }: IndicatorProps) => (
  <div className="flex items-center mb-1">
    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: color }} />
    <span className="text-sm">
      {text} {value}
    </span>
  </div>
);

export default OrdersWidget;
