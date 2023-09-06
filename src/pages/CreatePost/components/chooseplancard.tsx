import React, { useState } from 'react';

interface ChooseplancardProps {
    text: string;
    duration: string;
    reach: string;
    isSelected: boolean; 
    onClick: () => void;
}

const Chooseplancard: React.FC<ChooseplancardProps> = ({ text, duration, reach }) => {
    const [isSelected, setIsSelected] = useState(false);

    const borderColor = isSelected ? '#f21c29' : '#f1f1f1';

    const handleClick = () => {
        setIsSelected(!isSelected);
    };

    return (
        <div
            className={`flex-grow rounded-2xl mx-5 bg-white border p-3`}
            style={{ borderColor: borderColor, borderWidth: '4px' }}
            onClick={handleClick}
        >
            <div className='flex justify-between'>
                <div className='text-sm font-bold'>{text}</div>
                <div
                    className='w-7 h-7 mt-20 rounded-full text-center border'
                    style={{
                        borderColor: borderColor,
                        borderWidth: '5px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        marginTop: '0px',
                    }}
                ></div>
            </div>

            <div className='bg-[#f1f1f1] text-xs py-1 px-3 inline-block rounded-md mt-1'>
                {duration}
            </div>
            <div className='text-xs pt-2'>{reach}</div>
        </div>
    );
};

export default Chooseplancard;
