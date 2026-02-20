import React from "react";

interface InfoCardProps {
  cardName: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ cardName, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl border-2 border-backgroundcolor">
      <div className="flex flex-col items-center">
        <h3 className="text-sm font-bold text-gray-800">{cardName}</h3>
        <p className="mt-1 text-sm font-bold text-gray-700">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
