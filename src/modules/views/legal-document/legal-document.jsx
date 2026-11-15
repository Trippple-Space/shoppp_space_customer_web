'use client'

import React, { useState } from 'react';
import PrivacyPolicy from './tabs/privacy-policy/privacy-policy'
import TermsAndConditions from './tabs/terms-and-condition/terms-and-condition'
import ShippingPolicy from './tabs/shipping-policy/shipping-policy'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar';



const tabs = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'shipping', label: 'Shipping Policy' },
];


function LegalDocuments() {
  const [activeTab, setActiveTab] = useState('privacy');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsAndConditions />;
      case 'shipping':
        return <ShippingPolicy />;
      default:
        return null;
    }
  };


  return (
    <>
    <HomepageNavBar  parent={"checkout"}/>
    <div className="mt-[70px] mx-auto p-[20px] flex flex-col items-center justify-center cursor-pointer">
      <div className="flex justify-center  mb-[4px] gap-[15px]">
        {tabs.map((tab) => (
          <p
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` bg-transparent pb-[5px] text-[13px] lg:text-[20px] font-light ${activeTab == tab.id ? "border-[2px] border-b text-[12px] font-extrabold text-[#1677FF]": ""} `}
          >
            {tab.label}
          </p>
        ))}
      </div>
      <div className="bg-white p-[4px] rounded shadow">{renderTabContent()}</div>
      </div>
    </>
      
  );
}

export default LegalDocuments