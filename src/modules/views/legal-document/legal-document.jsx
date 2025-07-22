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
    <div className="mt-70 mx-auto p-20 flex flex-col a-items-center j-content-center cursor-pointer">
      <div className="flex j-content-center  mb-4 gap-15">
        {tabs.map((tab) => (
          <p
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` bg-none pb-5 text-13 l:text-20 weight-300 ${activeTab == tab.id ? "border-2 border-b text-12 weight-800 color-#1677FF": ""} `}
          >
            {tab.label}
          </p>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">{renderTabContent()}</div>
      </div>
    </>
      
  );
}

export default LegalDocuments