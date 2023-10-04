import React from 'react';

const TranslucentDiv = () => {
  const divStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 0.5 alpha for translucency
    color: 'white', // Text color
    borderRadius: '50px', // Rounded corners for the div
    display: 'inline-block', // Make the div only as wide as its content
  };

  const textStyle = {
    marginRight: '10px', // Add space between text and icon
  };

  const closeIconStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={divStyle} className="translucent-div rounded-full py-3 px-10">
      <span style={textStyle} className="text">
        Close
      </span>
      <span style={closeIconStyle} className="close-icon">
        X
      </span>
    </div>
  );
};

export default TranslucentDiv;
