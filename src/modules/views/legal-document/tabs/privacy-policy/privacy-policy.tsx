import React from 'react'
import { PrivacyPolicyType } from '@/modules/lib/utility/types/legal-types/privacy.policy.interface'
import privacyPolicyJson from '../../../../lib/utility/json-data/legal/privacy-policy.json'
import { contactEmail } from '@/modules/lib/utility/utility';





function PrivacyPolicy() {
  const policy: PrivacyPolicyType = privacyPolicyJson;
  return (
    <>
      <div className='flex flex-col a-items-center'>
        

      
    <h1 className='text-24 l:text-36 line-height-40 my-15 weight-700 text-dimgrey pt-5 l:pt-30  border-3 border-b pb-5 '>{policy.privacy_policy.title}</h1>
      
      </div>
      


      <div className='p-20 flex flex-col a-items-center'>
        <div  className='l:w-60p'>
          
        <ol>
            <li className='weight-500 text-20'>
              Introduction
            </li>
            <div className='weight-400 pb-10 border-b mb-10'>
            {policy.privacy_policy['1_introduction'].split('Nigeria Data Protection Regulation (NDPR)')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>Nigeria Data Protection Regulation (NDPR)</span>
              {policy.privacy_policy['1_introduction'].split('Nigeria Data Protection Regulation (NDPR)')[1]}
            </div>

            <li className='weight-500 text-20'>
              Information we Collect
            </li>

            <div className='pl-10 weight-400 border-b pb-10'>
              <p className='mt-10 mb-10'>
                We may collect the following types of personal data:
              </p>

              <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='weight-600'>Personal Identification Information:
{' '}
                  <span className='weight-400'>

                {policy.privacy_policy['2_information_we_collect'].personal_identification_information.join(", ")}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Account Information:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['2_information_we_collect'].account_information.join(", ")}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Transaction Information:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['2_information_we_collect'].transaction_information.join(", ")}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='weight-600 mt-10'>Device & Techical Information:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['2_information_we_collect'].device_and_technical_information.join(", ")}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='weight-600 mt-10'>Cookie and Usage Data:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['2_information_we_collect'].cookies_and_usage_data.join(", ")}
                  </span>
                  </p>
                </li>
                
              </ul>
           
            </div>

            <li className='weight-500 text-20 mt-10  mb-10'>
             Purpose of data collection
            </li>
            <div className='pl-10 weight-400 border-b pb-10'>
            <p className='mt-10 mb-10'>
            We collect and process your personal data for the following purposes:
            </p>

              <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                {policy.privacy_policy['3_purpose_of_data_collection'].map((reason) => <li className='mb-10'>{ reason}</li>)}
              </ul>
            </div>

            <li className='weight-500 text-20 mt-10  mb-10'>
              Legal Basis for Processing
            </li>
            <div className='pl-10 weight-400 border-b pb-10'>
            <p className='mt-10 mb-10'>
            We rely on the following legal bases for processing your data:
            </p>

            <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='weight-600'>Consent:
{' '}
                  <span className='weight-400'>

                {policy.privacy_policy['4_legal_basis_for_processing'].consent}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Contract:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].contract}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Legal Obligation:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].legal_obligation}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='weight-600 mt-10'>Legitimate Interest:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].legitimate_interest}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='weight-600 mt-10'>Cookie and Usage Data:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['2_information_we_collect'].cookies_and_usage_data.join(", ")}
                  </span>
                  </p>
                </li>
                
              </ul>
            </div>
         
            <li className='weight-500 text-20 mt-10  mb-10'>
            Data Sharing & Disclosure
            </li>
            <div className='pl-10 weight-400 border-b'>
            <p className='mt-10 mb-10'>
            We may share your personal data with:

            </p>

            <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='weight-600'>Vendor & Service Providers:
                    {' '}
                  <span className='weight-400'>

                {policy.privacy_policy['5_data_sharing_and_disclosure'].vendors_and_service_providers}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Third-Party Sellers:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['5_data_sharing_and_disclosure'].third_party_sellers}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Law Enforcement or Regulatory Authorities:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['5_data_sharing_and_disclosure'].law_enforcement}
                  </span>
                  </p>
                </li>

                <div className='weight-400 pb-10 mb-10 mt-10'>
            {policy.privacy_policy['5_data_sharing_and_disclosure'].note.split('not sell')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>not sell</span>
              {policy.privacy_policy['5_data_sharing_and_disclosure'].note.split('not sell')[1]}
            </div>
                
              </ul>
            </div>
         
            
            <li className='weight-500 text-20 mt-10  mb-10'>
            Data Retention
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['6_data_retention']}
            </div>



            <li className='weight-500 text-20 mt-10  mb-10'>
            Data Subject Rights
            </li>
            <div className='pl-10 weight-400 border-b pb-10'>
            <p className='mt-10 mb-10'>
            Under the NDPR, you have the following rights:
            </p>

            <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='weight-600'>Right to Access - 
{' '}
                  <span className='weight-400'>

                {policy.privacy_policy['7_data_subject_rights'].right_to_access}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Right to Rectification - {' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_rectification}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='weight-600 mt-10'>Right to Erasure:{' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_erasure}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='weight-600 mt-10'>Right to data Portability - {' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_data_portability}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='weight-600 mt-10'>Right to Object - {' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_object}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='weight-600 mt-10'>Right to Withdraw Consent - {' '}
                    <span className='weight-400'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_withdraw_consent}
                  </span>
                  </p>
                </li>
                <div className='weight-400 pb-10 mb-10 mt-10'>
                  You may exercise these rights by contacting us at{' '}
                  <span className='weight-600'>
                  {contactEmail}.
                  </span>

                  

            </div>
              </ul>
            </div>
         
            <li className='weight-500 text-20 mt-10  mb-10'>
            Cookies & Tracking Technologies
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['8_cookies_and_tracking_technologies']}
            </div>


            <li className='weight-500 text-20 mt-10  mb-10'>
            Data Security
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['9_data_security']}
            </div>

            <li className='weight-500 text-20 mt-10  mb-10'>
              Cross-Border Data Transfer
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['10_cross_border_data_transfers']}
            </div>

            <li className='weight-500 text-20 mt-10  mb-10'>
      Children's Privacy
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['11_childrens_privacy']}
            </div>


            <li className='weight-500 text-20 mt-10  mb-10'>
    Change to this Privacy Policy
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
            {policy.privacy_policy['12_changes_to_this_privacy_policy']}
            </div>


            <li className='weight-500 text-20 mt-10  mb-10'>
Contact Us
            </li>
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
     If you have questions, complaints, or requests regarding this policy or your 
              personal data, please contact:
              
              <div>Address: {policy.privacy_policy['13_contact_us'].address }</div>

            </div>
            
            <div className='weight-400 pb-10 border-b mb-10 mt-10'>
     If you have questions, complaints, or requests regarding this policy or your 
              personal data, please contact:
              
              <div className='weight-600 mt-5 mb-5'>Address: {policy.privacy_policy['13_contact_us'].address }</div>
              <div className='weight-600 mt-5 mb-5'>Email: {contactEmail }</div>

            </div>
          </ol>
        
        </div>

        
      </div>

    </>
 
  )
}

export default PrivacyPolicy