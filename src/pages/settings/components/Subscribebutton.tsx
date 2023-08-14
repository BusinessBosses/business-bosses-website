import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoutesPath from '../../../constants/Routes';
import Assets from '../../../assets';

const SubscribeButton = () => {
  const navigate = useNavigate();
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1', // Customize the background color as needed
    color: '#333333', // Change the text color to #333333
    borderRadius: '50px', // Adjust the radius to make the rectangle more or less round
    padding: '7px 15px',
    fontSize: '13px', // Change the font size to 14px
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const arrowStyle = {
    marginLeft: '10px', // Adjust the spacing between the text and the arrow as needed
  };

  return (
    <div style={buttonStyle} onClick={() => navigate(RoutesPath.subscriptionpage)}>
      <span className='mr-2' >Subscribe to Premium</span>
      <Assets.Nexticon stroke="#F21C29"/>
    </div>
  );
};

export default SubscribeButton;
