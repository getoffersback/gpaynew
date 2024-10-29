import React, { useEffect, useState } from 'react';
import B2 from '../assets/images/gpayfooter.webp';
import U5G from "../assets/images/5g.svg";
import ott from '../assets/images/ott.png';
import { Link } from 'react-router-dom';
import Airtel from "../assets/images/airtel.png";
import Jio from "../assets/images/jio.png";
import Bsnl from "../assets/images/bsnl.png";
import Vi from "../assets/images/vi.jpg";

const Getofffer = () => {
  const [show, setShow] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    openGpay();
  }, [price]);

  const openGpay = () => {
    if (price > 0) {
      if (!window.PaymentRequest) {
        console.log('Web payments are not supported in this browser.');
        return;
      }

      // UPI payment URL
      const upiPaymentUrl = 'upi://pay?ver=01&mode=19&pa=coachingcentre409665.rzp@icici&pn=Coachingcentre&tr=RZPPEsezVvnaTgJacqrv2&cu=INR&mc=8241&qrMedium=04&tn=PaymenttoCoachingcentre';

      // Create supported payment method using UPI URL
      const supportedInstruments = [
        {
          supportedMethods: ['https://tez.google.com/pay'],
          data: {
            pa: 'coachingcentre409665.rzp@icici', // Replace with your Merchant UPI ID
            pn: 'Coachingcentre', // Replace with your Merchant Name
            tr: 'RZPPEsezVvnaTgJacqrv2', // Your custom transaction reference ID
            url: 'https://yourwebsite.com/order/1234ABCD', // URL of the order in your website
            mc: '8241', // Your merchant category code
            tn: 'Payment to Coachingcentre' // Transaction note
          },
        }
      ];

      // Create order detail data.
      const details = {
        total: {
          label: 'Total',
          amount: {
            currency: 'INR',
            value: price, // Amount to be paid
          },
        },
        displayItems: [{
          label: 'Original Amount',
          amount: {
            currency: 'INR',
            value: price,
          },
        }],
      };

      // Create payment request object.
      let request = null;
      try {
        request = new PaymentRequest(supportedInstruments, details);
      } catch (e) {
        console.log('Payment Request Error: ' + e.message);
        return;
      }
      if (!request) {
        console.log('Web payments are not supported in this browser.');
        return;
      }

      const canMakePaymentPromise = checkCanMakePayment(request);
      canMakePaymentPromise
        .then((result) => {
          showPaymentUI(request, result);
        })
        .catch((err) => {
          console.log('Error calling checkCanMakePayment: ' + err);
        });
    }
  };

  function checkCanMakePayment(request) {
    const canMakePaymentCache = 'canMakePaymentCache';

    if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
      return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
    }

    // If canMakePayment() isn't available, default to assuming that the method is supported.
    let canMakePaymentPromise = Promise.resolve(true);

    // Feature detect canMakePayment().
    if (request.canMakePayment) {
      canMakePaymentPromise = request.canMakePayment();
    }

    return canMakePaymentPromise
      .then((result) => {
        sessionStorage[canMakePaymentCache] = result;
        return result;
      })
      .catch((err) => {
        console.log('Error calling canMakePayment: ' + err);
      });
  }

  function showPaymentUI(request, canMakePayment) {
    if (!canMakePayment) {
      console.log('Google Pay is not ready to pay.');
      return;
    }

    // Set payment timeout.
    const paymentTimeout = window.setTimeout(() => {
      window.clearTimeout(paymentTimeout);
      request.abort()
        .then(() => {
          console.log('Payment timed out.');
        })
        .catch(() => {
          console.log('Unable to abort, user is in the process of paying.');
        });
    }, 20 * 60 * 1000); /* 20 minutes */

    request.show()
      .then(() => {
        window.clearTimeout(paymentTimeout);
        setShow(true);
        // You can navigate to the UPI URL directly or handle success response
        window.location.href = upiPaymentUrl; // Redirect to UPI payment
      })
      .catch((err) => {
        console.log(err);
        setCancel(true);
      });
  }


  return (
    <div>

      <div className="bg-white py-4 px-4 text-[13.4px] flex items-center justify-between">
        <div className="flex items-center">
          {localStorage.np &&
            <img src={localStorage.np === "jio" ? Jio : localStorage.np === "airtel" ? Airtel : localStorage.np === "vi" ? Vi : localStorage.np === "bsnl" ? Bsnl : Jio} alt="" className='h-12 rounded-full' />}

          <div className="font-bold text-[14px] text-blue-900 ml-2">
            <div> Recharge for: {localStorage.number && localStorage.number}</div>

            <div className="text-slate-500 font-normal text-[12px] mt-[-2px]">


              {localStorage.np === "jio" ? "Jio" : localStorage.np === "airtel" ? "Airtel" : localStorage.np === "vi" ? "VI" : localStorage.np === "bsnl" ? "BSNL" : "Jio"} Prepaid</div>
          </div>
        </div>
        <Link to="/" className="text-blue-600">Change</Link>
      </div>
      <div className=" px-2 my-0 bg-blue-50 py-5">
        <h1 className="text-[20px] font-bold text-center  mt-[-2px]">Diwali Recharge offer + OTTs Free</h1>
      </div>
    <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100">
          <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">Exclusive</div>
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center text-[20px] font-bold text-slate-800">
              <div>₹389</div>
              <div className="ml-4 line-through text-slate-600">₹2499</div>
            </div>
            <div><img src={U5G} alt="" /></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="">
              <div className="text-slate-600 text-[13px]">VALIDITY</div>
              <div className="text-slate-800 text-[13px] font-bold">12 month</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">DATA</div>
              <div className="text-slate-800 text-[13px] font-bold">2.0 GB/day</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">Voice</div>
              <div className="text-slate-800 text-[13px] font-bold">Unlimited</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">SMS</div>
              <div className="text-slate-800 text-[13px] font-bold">100/day</div>
            </div>
          </div>
           <div style={{ marginTop: '10px' }}>
    <div className="text-slate-600 text-[13px]">SUBSCRIPTION</div>
    <div
        className="flex items-center"
        style={{ gap: '10px', marginTop: '2px' }}
    >
        <img
            src="https://diwaligift.online/assets/website/images/jiotv.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/jiocinema.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/netflix.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/amazonprime.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/disney.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/sony.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
    </div>
</div>

          <div className="mt-5">
            <button onClick={() => setPrice(389.99)} className="bg-blue-500 py-2 w-full text-[13px] rounded-full font-bold text-white">Recharge</button>
          </div>
        </div>
      <div className="px-5 bg-white pt-1">
        <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100">
          <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">Special Offer</div>
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center text-[20px] font-bold text-slate-800">
              <div>₹149</div>
              <div className="ml-4 line-through text-slate-600">₹749</div>
            </div>
            <div><img src={U5G} alt="" /></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="">
              <div className="text-slate-600 text-[13px]">VALIDITY</div>
              <div className="text-slate-800 text-[13px] font-bold">84 days</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">DATA</div>
              <div className="text-slate-800 text-[13px] font-bold">1.5 GB/day</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">Voice</div>
              <div className="text-slate-800 text-[13px] font-bold">Unlimited</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">SMS</div>
              <div className="text-slate-800 text-[13px] font-bold">100/day</div>
            </div>
             
          </div>
  <div style={{ marginTop: '10px' }}>
    <div className="text-slate-600 text-[13px]">SUBSCRIPTION</div>
    <div
        className="flex items-center"
        style={{ gap: '10px', marginTop: '2px' }}
    >
        <img
            src="https://diwaligift.online/assets/website/images/jiotv.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/jiocinema.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/netflix.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/amazonprime.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/disney.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/sony.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
    </div>
</div>

  
          <div className="mt-5">
            <button onClick={() => setPrice(149.99)} className="bg-blue-500 py-2 w-full text-[13px] rounded-full font-bold text-white">Recharge</button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100">
          <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">Exclusive</div>
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center text-[20px] font-bold text-slate-800">
              <div>₹199</div>
              <div className="ml-4 line-through text-slate-600">₹999</div>
            </div>
            <div><img src={U5G} alt="" /></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="">
              <div className="text-slate-600 text-[13px]">VALIDITY</div>
              <div className="text-slate-800 text-[13px] font-bold">84 days</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">DATA</div>
              <div className="text-slate-800 text-[13px] font-bold">2.0 GB/day</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">Voice</div>
              <div className="text-slate-800 text-[13px] font-bold">Unlimited</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">SMS</div>
              <div className="text-slate-800 text-[13px] font-bold">100/day</div>
            </div>
          </div>
           <div style={{ marginTop: '10px' }}>
    <div className="text-slate-600 text-[13px]">SUBSCRIPTION</div>
    <div
        className="flex items-center"
        style={{ gap: '10px', marginTop: '2px' }}
    >
        <img
            src="https://diwaligift.online/assets/website/images/jiotv.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/jiocinema.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/netflix.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/amazonprime.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/disney.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/sony.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
    </div>
</div>

          <div className="mt-5">
            <button onClick={() => setPrice(199.99)} className="bg-blue-500 py-2 w-full text-[13px] rounded-full font-bold text-white">Recharge</button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100">
          <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">Exclusive</div>
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center text-[20px] font-bold text-slate-800">
              <div>₹249</div>
              <div className="ml-4 line-through text-slate-600">₹1299</div>
            </div>
            <div><img src={U5G} alt="" /></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="">
              <div className="text-slate-600 text-[13px]">VALIDITY</div>
              <div className="text-slate-800 text-[13px] font-bold">84 days</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">DATA</div>
              <div className="text-slate-800 text-[13px] font-bold">3.0 GB/day</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">Voice</div>
              <div className="text-slate-800 text-[13px] font-bold">Unlimited</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">SMS</div>
              <div className="text-slate-800 text-[13px] font-bold">100/day</div>
            </div>
          </div>
           <div style={{ marginTop: '10px' }}>
    <div className="text-slate-600 text-[13px]">SUBSCRIPTION</div>
    <div
        className="flex items-center"
        style={{ gap: '10px', marginTop: '2px' }}
    >
        <img
            src="https://diwaligift.online/assets/website/images/jiotv.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/jiocinema.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/netflix.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/amazonprime.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/disney.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/sony.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
    </div>
</div>

          <div className="mt-5">
            <button onClick={() => setPrice(249.99)} className="bg-blue-500 py-2 w-full text-[13px] rounded-full font-bold text-white">Recharge</button>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 my-4 shadow-xl shadow-blue-100">
          <div className="bg-rose-600 py-1 px-3 rounded text-white text-[10px] font-bold w-fit">Exclusive</div>
          <div className="flex items-center justify-between my-2">
            <div className="flex items-center text-[20px] font-bold text-slate-800">
              <div>₹279</div>
              <div className="ml-4 line-through text-slate-600">₹1999</div>
            </div>
            <div><img src={U5G} alt="" /></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="">
              <div className="text-slate-600 text-[13px]">VALIDITY</div>
              <div className="text-slate-800 text-[13px] font-bold">6 month</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">DATA</div>
              <div className="text-slate-800 text-[13px] font-bold">2.0 GB/day</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">Voice</div>
              <div className="text-slate-800 text-[13px] font-bold">Unlimited</div>
            </div>
            <div className="">
              <div className="text-slate-600 text-[13px]">SMS</div>
              <div className="text-slate-800 text-[13px] font-bold">100/day</div>
            </div>
          </div>
           <div style={{ marginTop: '10px' }}>
    <div className="text-slate-600 text-[13px]">SUBSCRIPTION</div>
    <div
        className="flex items-center"
        style={{ gap: '10px', marginTop: '2px' }}
    >
        <img
            src="https://diwaligift.online/assets/website/images/jiotv.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/jiocinema.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/netflix.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/amazonprime.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/disney.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
        <img
            src="https://diwaligift.online/assets/website/images/sony.svg"
            alt=""
            className="mx-1"
            style={{ height: '35px', width: '35px', borderRadius: '20px' }}
        />
    </div>
</div>

          <div className="mt-5">
            <button onClick={() => setPrice(279.99)} className="bg-blue-500 py-2 w-full text-[13px] rounded-full font-bold text-white">Recharge</button>
          </div>
        </div>
        
      <div>

      </div>
      <img src={B2} alt="" className="mt-10" />



      {show &&
        <div tabindex="-1" className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-slate-950/[.8]">
          <div className="relative p-4 w-full max-w-md max-h-full top-1/3">
            <div className="relative bg-white rounded-lg shadow">
              <button type="button" onClick={() => setShow(false)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">Technical Error!! Your Money will be refunded within 24hrs</h3>
                <button type="button" onClick={() => openGpay()} className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Pay Again For Recharge
                </button>
              </div>
            </div>
          </div>
        </div>}
      {cancel &&
        <div tabindex="-1" className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full bg-slate-950/[.8]">
          <div className="relative p-4 w-full max-w-md max-h-full top-1/3">
            <div className="relative bg-white rounded-lg shadow">
              <button type="button" onClick={() => setCancel(false)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">your transaction has been declined!</h3>
                <button type="button" onClick={() => openGpay()} className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Try Again
                </button>
                <button type="button" onClick={() => setCancel(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Close</button>
              </div>
            </div>
          </div>
        </div>}

    </div>
  )
}

export default Getofffer
