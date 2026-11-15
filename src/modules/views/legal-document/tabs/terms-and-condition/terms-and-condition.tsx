import React from 'react'
import termsAndCondition from '../../../../lib/utility/json-data/legal/t&c.json'
import { TermsAndConditionsJson } from '@/modules/lib/utility/types/legal-types/terms.condition.interface'
import { contactEmail } from '@/modules/lib/utility/utility';

function TermsAndCondition() {

  const TermsAndConditionJson:TermsAndConditionsJson = termsAndCondition;
  return (
    <>
    
    <div className='flex flex-col items-center'>
        

      
        <h1 className='text-[24px] lg:text-[36px] leading-[40px] my-[15px] font-bold text-[#333333] pt-[5px] lg:pt-[30px]  border-[3px] border-b pb-[5px] '>Terms of Service (ToS) / Terms and Conditions (T&C)</h1>
          
          </div>
          
    
    
          <div className='p-[20px] flex flex-col items-center'>
            <div  className='lg:w-[60%]'>
              
            <ol className='pb-[10px] border-b'>
                <li className='font-medium text-[20px]'>
                  Introduction
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px]'>
                {termsAndCondition.terms_and_conditions['1_introduction']}
          
                </div>
    
                <li className='font-medium text-[20px]'>
                  Use of Services
                </li>
    
                <div className='pl-[10px] font-normal border-b pb-[10px]'>
          
    
                  <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>Eligibility:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['2_use_of_services'].eligibility}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Account Registration:{' '}
                        <span className='font-normal'>
                          {termsAndCondition.terms_and_conditions['2_use_of_services'].account_registration}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Prohibited Conduct:{' '}
                        <span className='font-normal'>
                      You agree not to engage in any activity that:  
                      
                      <div className='pl-[15px]'>
                        <ul style={{ listStyleType: 'circle' }}>
                          {termsAndCondition.terms_and_conditions['2_use_of_services'].prohibited_conduct.map((conduct, index) => (
                            <li key={index} className='mb-[5px]'>{conduct}</li>
                          ))}
                        </ul>
                      </div>
                      </span>
                      </p>
                    </li>
    
  
                    
                  </ul>
               
                </div>
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
               Product And Orders
                </li>
            <div className='pl-[10px] font-normal border-b pb-[10px]'>
          
    
                  <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>Product Descriptions:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].product_descriptions}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold'>Pricing:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].pricing}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold'>Order Acceptance:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].order_acceptance}
                      </span>
                      </p>
    
                    </li>
                
             
           
                  </ul>
               
                </div>
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
                Payment
                </li>
                <div className='pl-[10px] font-normal border-b pb-[10px]'>
            
    
                <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>Payment Method:
    {' '}
                      <span className='font-normal'>
     {termsAndCondition.terms_and_conditions['4_payments'].payment_methods}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Billing Information:{' '}
                        <span className='font-normal'>
                          {termsAndCondition.terms_and_conditions['4_payments'].billing_information}
                      </span>
                      </p>
    
                    </li>
           
          
                    
                  </ul>
                </div>
             
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
                Shipping & Delivery
                </li>
                <div className='pl-[10px] font-normal border-b'>
           
    
                <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>Shipping Policy:
                        {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['5_shipping_and_delivery'].shipping_policy_reference}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Risk of Loss:{' '}
                        <span className='font-normal'>
                          {termsAndCondition.terms_and_conditions['5_shipping_and_delivery'].risk_of_loss}
                      </span>
                      </p>
    
                    </li>
           
    
           
                    
                  </ul>
                </div>
             
                
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
                Return and Delivery
            </li>
            
            <div className='pl-[10px] font-normal border-b pb-[10px]'>
            <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>Return Policy:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['6_returns_and_refunds'].return_policy_reference}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Limited License{' '}
                        <span className='font-normal'>
                          {termsAndCondition.terms_and_conditions['7_intellectual_property'].limited_license}
                      </span>
                      </p>
    
                    </li>
               
    
            
                  </ul>
    
    </div>
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
          Intellectual Property
                </li>
                <div className='pl-[10px] font-normal border-b pb-[10px]'>
          
    
                <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='font-semibold'>OwnerShip:
    {' '}
                      <span className='font-normal'>
    
                    {termsAndCondition.terms_and_conditions['7_intellectual_property'].ownership}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='font-semibold mt-[10px]'>Limited License{' '}
                        <span className='font-normal'>
                          {termsAndCondition.terms_and_conditions['7_intellectual_property'].limited_license}
                      </span>
                      </p>
    
                    </li>
               
    
            
                  </ul>
                </div>
             
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
                Limitation of Liability
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                {termsAndCondition.terms_and_conditions['8_limitation_of_liability']}
                </div>
    
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
 Indemnification
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                {termsAndCondition.terms_and_conditions['9_indemnification']}
                </div>
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
            Governing Law
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                {termsAndCondition.terms_and_conditions['10_governing_law']}
                </div>
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
   Change to Terms
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                {termsAndCondition.terms_and_conditions['11_changes_to_terms']}
                </div>
    
    
         
       
    
    
                <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
    Contact Us
                </li>
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                If you have any questions about these Terms, please contact us at:

                  
 
    
                </div>
                
                <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
         If you have questions, complaints, or requests regarding this policy or your 
                  personal data, please contact:
                  
                  <div className='font-semibold mt-[5px] mb-[5px]'>Email: {contactEmail }</div>
                  <div className='font-semibold mt-[5px] mb-[5px]'>Address: {termsAndCondition.terms_and_conditions['12_contact_us'].address}</div>
    
                </div>
          <p className='w-[60%] font-normal mb-[10px] mt-[10px]'>
            
          By using our Services, you acknowledge that you have read, understood, and 
          agree to be bound by these Terms and Conditions.
            </p>
              </ol>
            </div>
    
              
    

        
          </div>
    
    </>
  )
}

export default TermsAndCondition