import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoutesPath from '../../../constants/Routes';

const SubscribeButton = () => {
  const navigate = useNavigate();
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA', // Customize the background color as needed
    color: '#333333', // Change the text color to #333333
    borderRadius: '50px', // Adjust the radius to make the rectangle more or less round
    padding: '7px 15px',
    fontSize: '14px', // Change the font size to 14px
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const arrowStyle = {
    marginLeft: '10px', // Adjust the spacing between the text and the arrow as needed
  };

  return (
    <div style={buttonStyle} onClick={() => navigate(RoutesPath.subscriptionpage)}>
      <span>Subscribe to Premium</span>
      <div style={arrowStyle}>&#10148;</div>
    </div>
  );
};

export default SubscribeButton;
