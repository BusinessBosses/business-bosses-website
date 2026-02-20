import React from 'react';

import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import Assets from '../../../assets';
import FilledButtonsmall from '../../../common/components/buttons/FilledButtonsmall';
import RoutesPath from '../../../constants/Routes';
import { useRouter } from 'next/navigation';
import Choosepaymentoptioncard from '../components/choosepaymentoptioncard';
import { Helmet } from 'react-helmet';

const ReviewPaymentPage: React.FC = () => {
  const router = useRouter();

  return (<div>

    <Helmet>
      <title>Review Payment - Business Bosses</title>
    </Helmet>


    <div className="mobile-only bg-white " style={{ height: "100vh" }} >
      <div
        className="bg-white top-0 w-full z-50"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
        }}
      >
        <CommonPageHeader title="Review Payment" />
      </div>
      <div className='bg-[#f4f4f4] w-full h-5'></div>
      <div className='flex px-5 bg-white'>
        <div style={{ position: "relative" }}>
          <div
            className=''
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: "4px",
              height: "100%",
              background: "transparent",
              borderLeft: "4px dashed #f4f4f4",
            }}
          >
          </div>
          <div className='' style={{ position: "relative" }}>
            <div
              className="w-7 h-7 mt-10 rounded-full text-center border border-primary"
              style={{
                borderWidth: "7px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold"
              }}
            ></div>
            <div
              className="w-7 h-7 mt-20 rounded-full text-center border border-primary"
              style={{
                borderWidth: "7px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                marginTop: "220px"

              }}
            ></div>
          </div>
        </div>


        <main>
          <div className=" payment-confirmed ml-5 mt-10">
            <div
              className="px-5 py-5 text-xs lg:text-base font-[500]"
              style={{
                borderRadius: "16px",
                background: "#fff",
                display: "flex",
                borderWidth: "4px",
                borderColor: "#f4f4f4",
                flexDirection: "column",
                alignItems: "start",
                textAlign: "center",
              }}
            >
              <div className='flex w-full justify-between'>
                <div> Selected Plan</div>
                <div> Monthly</div>
              </div>
              <div className='flex w-full justify-between'>
                <div>Total to pay:</div>
                <div>$4.99</div>
              </div>
              <div>
                <img src={Assets.Planpicture} style={{ maxWidth: '140px', maxHeight: '100px' }} />
              </div>

              <div className='flex justify-between w-full'>
                <div className='flex'>
                  <div>45%</div>
                  <div> of our users choose this plan</div>
                </div>
                <div>Switch</div>
              </div>
            </div>

            <h2 className="text-sm font-bold lg:text-base my-5 pt-10" style={{}}>Select a Payment Option</h2>
            <Choosepaymentoptioncard text={'Card Payment'} isSelected={false} onClick={function (): void {
              throw new Error('Function not implemented.');
            }} />
            <Choosepaymentoptioncard text={'Google Pay'} isSelected={false} onClick={function (): void {
              throw new Error('Function not implemented.');
            }} />
            <Choosepaymentoptioncard text={'Apple Pay'} isSelected={false} onClick={function (): void {
              throw new Error('Function not implemented.');
            }} />
            <Choosepaymentoptioncard text={'PayPal'} isSelected={false} onClick={function (): void {
              throw new Error('Function not implemented.');
            }} />




          </div>
        </main>

      </div>
      <div className='px-5 pt-20'>
        <FilledButtonsmall className='py-4 w-full' onClick={() => router.push(RoutesPath.home)} text={'Pay'} />
      </div>

    </div>

  </div>
  );
};

export default ReviewPaymentPage;
