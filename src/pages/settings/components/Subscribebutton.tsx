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
    backgroundColor: '#F21C29', // Customize the background color as needed
    color: '#333333', // Change the text color to #333333
    borderRadius: '50px', // Adjust the radius to make the rectangle more or less round
    padding: '7px 15px',
    fontSize: '13px', // Change the font size to 14px
    fontWeight: 'bold',
    cursor: 'pointer',
  };



  return (
    <div style={buttonStyle} onClick={() => navigate(RoutesPath.subscriptionpage)}>
      <span className='mr-2' style={{color: '#ffffff'}} >Subscribe to Premium</span>
      <Assets.Nexticon stroke="#ffffff"/>
    </div>
  );
};

export default SubscribeButton;
