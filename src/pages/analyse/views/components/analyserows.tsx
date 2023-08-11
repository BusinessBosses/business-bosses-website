import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AnalyseRowsProps {
    leadingSvg: React.ReactNode;
    middleText: string;
    endingSvg: React.ReactNode;
    onClick?: () => void; // Define the type for the onClick function
}

const Analyserows = ({ leadingSvg, middleText, endingSvg, onClick }: AnalyseRowsProps) => {
    const navigate = useNavigate();

    return (
        <div onClick={onClick}> {/* Attach the onClick handler here */}

            <div className="mobile-only">
                <div style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>
                <div className="bg-white px-4 pl-4 py-3 flex items-center justify-between">

                    {leadingSvg}

                    <div className="flex-grow text-start ml-10">
                        <p className="text-sm font-semibold py-2">{middleText}</p>
                    </div>
                    <div></div> {/* This empty div helps in spacing */}
                    {endingSvg}
                </div>
            </div>
        </div>
    );
};

export default Analyserows;
