import React from 'react'
import { PrivacyPolicyType } from '@/modules/lib/utility/types/legal-types/privacy.policy.interface'
import privacyPolicyJson from '../../../../lib/utility/json-data/legal/privacy-policy.json'
import { contactEmail } from '@/modules/lib/utility/utility';





function PrivacyPolicy() {
  const policy: PrivacyPolicyType = privacyPolicyJson;
  return (
    <>
      <div className='flex flex-col items-center'>
        

      
    <h1 className='text-[24px] lg:text-[36px] leading-[40px] my-[15px] font-bold text-[#333333] pt-[5px] lg:pt-[30px]  border-[3px] border-b pb-[5px] '>{policy.privacy_policy.title}</h1>
      
      </div>
      


      <div className='p-[20px] flex flex-col items-center'>
        <div  className='lg:w-[60%]'>
          
        <ol>
            <li className='font-medium text-[20px]'>
              Introduction
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px]'>
            {policy.privacy_policy['1_introduction'].split('Nigeria Data Protection Regulation (NDPR)')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>Nigeria Data Protection Regulation (NDPR)</span>
              {policy.privacy_policy['1_introduction'].split('Nigeria Data Protection Regulation (NDPR)')[1]}
            </div>

            <li className='font-medium text-[20px]'>
              Information we Collect
            </li>

            <div className='pl-[10px] font-normal border-b pb-[10px]'>
              <p className='mt-[10px] mb-[10px]'>
                We may collect the following types of personal data:
              </p>

              <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='font-semibold'>Personal Identification Information:
{' '}
                  <span className='font-normal'>

                {policy.privacy_policy['2_information_we_collect'].personal_identification_information.join(", ")}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Account Information:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['2_information_we_collect'].account_information.join(", ")}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Transaction Information:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['2_information_we_collect'].transaction_information.join(", ")}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='font-semibold mt-[10px]'>Device & Techical Information:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['2_information_we_collect'].device_and_technical_information.join(", ")}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Cookie and Usage Data:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['2_information_we_collect'].cookies_and_usage_data.join(", ")}
                  </span>
                  </p>
                </li>
                
              </ul>
           
            </div>

            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
             Purpose of data collection
            </li>
            <div className='pl-[10px] font-normal border-b pb-[10px]'>
            <p className='mt-[10px] mb-[10px]'>
            We collect and process your personal data for the following purposes:
            </p>

              <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                {policy.privacy_policy['3_purpose_of_data_collection'].map((reason) => <li className='mb-[10px]'>{ reason}</li>)}
              </ul>
            </div>

            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
              Legal Basis for Processing
            </li>
            <div className='pl-[10px] font-normal border-b pb-[10px]'>
            <p className='mt-[10px] mb-[10px]'>
            We rely on the following legal bases for processing your data:
            </p>

            <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='font-semibold'>Consent:
{' '}
                  <span className='font-normal'>

                {policy.privacy_policy['4_legal_basis_for_processing'].consent}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Contract:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].contract}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Legal Obligation:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].legal_obligation}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='font-semibold mt-[10px]'>Legitimate Interest:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['4_legal_basis_for_processing'].legitimate_interest}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Cookie and Usage Data:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['2_information_we_collect'].cookies_and_usage_data.join(", ")}
                  </span>
                  </p>
                </li>
                
              </ul>
            </div>
         
            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Data Sharing & Disclosure
            </li>
            <div className='pl-[10px] font-normal border-b'>
            <p className='mt-[10px] mb-[10px]'>
            We may share your personal data with:

            </p>

            <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='font-semibold'>Vendor & Service Providers:
                    {' '}
                  <span className='font-normal'>

                {policy.privacy_policy['5_data_sharing_and_disclosure'].vendors_and_service_providers}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Third-Party Sellers:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['5_data_sharing_and_disclosure'].third_party_sellers}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Law Enforcement or Regulatory Authorities:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['5_data_sharing_and_disclosure'].law_enforcement}
                  </span>
                  </p>
                </li>

                <div className='font-normal pb-[10px] mb-[10px] mt-[10px]'>
            {policy.privacy_policy['5_data_sharing_and_disclosure'].note.split('not sell')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>not sell</span>
              {policy.privacy_policy['5_data_sharing_and_disclosure'].note.split('not sell')[1]}
            </div>
                
              </ul>
            </div>
         
            
            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Data Retention
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['6_data_retention']}
            </div>



            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Data Subject Rights
            </li>
            <div className='pl-[10px] font-normal border-b pb-[10px]'>
            <p className='mt-[10px] mb-[10px]'>
            Under the NDPR, you have the following rights:
            </p>

            <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                <li>
                  <p className='font-semibold'>Right to Access - 
{' '}
                  <span className='font-normal'>

                {policy.privacy_policy['7_data_subject_rights'].right_to_access}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Right to Rectification - {' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_rectification}
                  </span>
                  </p>

                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Right to Erasure:{' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_erasure}
                  </span>
                  </p>
                </li>

                <li>
                  <p className='font-semibold mt-[10px]'>Right to data Portability - {' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_data_portability}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Right to Object - {' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_object}
                  </span>
                  </p>
                </li>
                <li>
                  <p className='font-semibold mt-[10px]'>Right to Withdraw Consent - {' '}
                    <span className='font-normal'>
                      {policy.privacy_policy['7_data_subject_rights'].right_to_withdraw_consent}
                  </span>
                  </p>
                </li>
                <div className='font-normal pb-[10px] mb-[10px] mt-[10px]'>
                  You may exercise these rights by contacting us at{' '}
                  <span className='font-semibold'>
                  {contactEmail}.
                  </span>

                  

            </div>
              </ul>
            </div>
         
            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Cookies & Tracking Technologies
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['8_cookies_and_tracking_technologies']}
            </div>


            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Data Security
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['9_data_security']}
            </div>

            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
              Cross-Border Data Transfer
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['10_cross_border_data_transfers']}
            </div>

            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
      Children's Privacy
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['11_childrens_privacy']}
            </div>


            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
    Change to this Privacy Policy
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
            {policy.privacy_policy['12_changes_to_this_privacy_policy']}
            </div>


            <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
Contact Us
            </li>
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
     If you have questions, complaints, or requests regarding this policy or your 
              personal data, please contact:
              
              <div>Address: {policy.privacy_policy['13_contact_us'].address }</div>

            </div>
            
            <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
     If you have questions, complaints, or requests regarding this policy or your 
              personal data, please contact:
              
              <div className='font-semibold mt-[5px] mb-[5px]'>Address: {policy.privacy_policy['13_contact_us'].address }</div>
              <div className='font-semibold mt-[5px] mb-[5px]'>Email: {contactEmail }</div>

            </div>
          </ol>
        
        </div>

        
      </div>

    </>
 
  )
}

export default PrivacyPolicy