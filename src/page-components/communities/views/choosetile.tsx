import React from 'react';

const ChooseTile: React.FC = () => {
  const centeredTextStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <div style={centeredTextStyle}>
      Select a tile to display feed
    </div>
  );
};

export default ChooseTile;
