import React from 'react';

interface ChoosepaymentoptioncardProps {
    text: string;
    isSelected: boolean;
    onClick: () => void;
}

const Choosepaymentoptioncard: React.FC<ChoosepaymentoptioncardProps> = ({
    text,
    isSelected,
    onClick,
}) => {
    const borderColor = isSelected ? '#f21c29' : '#f1f1f1';

    return (
        <div
            className={`flex-grow rounded-2xl mb-3 bg-white border p-2.5`}
            style={{ borderColor: borderColor, borderWidth: '4px' }}
            onClick={onClick} 
        >
            <div className='flex justify-between items-center'>
                <div className='text-sm font-bold'>{text}</div>
                <div
                    className='w-4 h-4 mt-20 rounded-full text-center border'
                    style={{
                        borderColor: borderColor,
                        borderWidth: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        marginTop: '0px',
                    }}
                ></div>
            </div>

        </div>
    );
};

export default Choosepaymentoptioncard;
