import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const Ratingbar: React.FC<ProgressBarProps> = ({
  progress,

}) => {
  const parentDivStyle: React.CSSProperties = {
    width: 60,
    height: 13,
    backgroundColor: '#9e9e9e',
    borderRadius: 50,
    overflow: 'hidden', // Hide overflowing content
  };

  const childDivStyle: React.CSSProperties = {
    width: `${progress}%`,
    height: '100%',
    backgroundColor: '#f2b23e',
    borderRadius: 50,
  };

  return (
    <div className='ml-2' style={parentDivStyle}>
      <div style={childDivStyle}></div>
    </div>
  );
};

export default Ratingbar;
