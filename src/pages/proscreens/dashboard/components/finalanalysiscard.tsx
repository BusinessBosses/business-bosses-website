import React from "react";
import { useNavigate } from "react-router-dom";

interface FinancialAnalysisProps {
  shop: { currency: string };
  shopStats: { totalAmount: number; totalExpenses: number };
}

const FinancialAnalysisWidget: React.FC<FinancialAnalysisProps> = ({
  shop,
  shopStats,
}) => {
  const navigate = useNavigate();

  const formatNumber = (number: number) => {
    if (!number) return "0";
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toFixed(1);
  };

  if (!shopStats) {
    return (
      <div className="p-4 text-center">
        <p>No Data To Show On Graph!</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="w-full p-4 bg-white rounded-2xl border-2 border-backgroundcolor cursor-pointer">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold">Financial Analysis</h2>
          </div>

          <div className="mt-2.5">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full rounded-lg ">
                <thead>
                    <tr className="bg-backgroundcolor border-b border-backgroundcolor text-gray-700">
                    <th className="p-2 text-sm text-center font-bold border-r border-backgroundcolor">
                      Sales from All Orders
                    </th>
                    <th className="p-2 text-sm text-center font-bold">
                      Expenses from Tasks
                    </th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center border-r border-backgroundcolor">
                      <span className="font-bold text-sm text-gray-700">
                        {shop?.currency || ""}
                        {formatNumber(shopStats?.totalAmount)}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="font-bold text-sm text-gray-700">
                        {shop?.currency || ""}
                        {formatNumber(shopStats?.totalExpenses)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisWidget;
