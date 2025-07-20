import React from 'react'
import termsAndCondition from '../../../../lib/utility/json-data/legal/t&c.json'
import { TermsAndConditionsJson } from '@/modules/lib/utility/types/legal-types/terms.condition.interface'
import { contactEmail } from '@/modules/lib/utility/utility';

function TermsAndCondition() {

  const TermsAndConditionJson:TermsAndConditionsJson = termsAndCondition;
  return (
    <>
    
    <div className='flex flex-col a-items-center'>
        

      
        <h1 className='text-24 l:text-36 line-height-40 my-15 weight-700 text-dimgrey pt-5 l:pt-30  border-3 border-b pb-5 '>Terms of Service (ToS) / Terms and Conditions (T&C)</h1>
          
          </div>
          
    
    
          <div className='p-20 flex flex-col a-items-center'>
            <div  className='l:w-60p'>
              
            <ol className='pb-10 border-b'>
                <li className='weight-500 text-20'>
                  Introduction
                </li>
                <div className='weight-400 pb-10 border-b mb-10'>
                {termsAndCondition.terms_and_conditions['1_introduction']}
          
                </div>
    
                <li className='weight-500 text-20'>
                  Use of Services
                </li>
    
                <div className='pl-10 weight-400 border-b pb-10'>
          
    
                  <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>Eligibility:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['2_use_of_services'].eligibility}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Account Registration:{' '}
                        <span className='weight-400'>
                          {termsAndCondition.terms_and_conditions['2_use_of_services'].account_registration}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Prohibited Conduct:{' '}
                        <span className='weight-400'>
                      You agree not to engage in any activity that:  
                      
                      <div className='pl-15'>
                        <ul style={{ listStyleType: 'circle' }}>
                          {termsAndCondition.terms_and_conditions['2_use_of_services'].prohibited_conduct.map((conduct, index) => (
                            <li key={index} className='mb-5'>{conduct}</li>
                          ))}
                        </ul>
                      </div>
                      </span>
                      </p>
                    </li>
    
  
                    
                  </ul>
               
                </div>
    
                <li className='weight-500 text-20 mt-10  mb-10'>
               Product And Orders
                </li>
            <div className='pl-10 weight-400 border-b pb-10'>
          
    
                  <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>Product Descriptions:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].product_descriptions}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600'>Pricing:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].pricing}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600'>Order Acceptance:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['3_products_and_orders'].order_acceptance}
                      </span>
                      </p>
    
                    </li>
                
             
           
                  </ul>
               
                </div>
    
                <li className='weight-500 text-20 mt-10  mb-10'>
                Payment
                </li>
                <div className='pl-10 weight-400 border-b pb-10'>
            
    
                <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>Payment Method:
    {' '}
                      <span className='weight-400'>
     {termsAndCondition.terms_and_conditions['4_payments'].payment_methods}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Billing Information:{' '}
                        <span className='weight-400'>
                          {termsAndCondition.terms_and_conditions['4_payments'].billing_information}
                      </span>
                      </p>
    
                    </li>
           
          
                    
                  </ul>
                </div>
             
                <li className='weight-500 text-20 mt-10  mb-10'>
                Shipping & Delivery
                </li>
                <div className='pl-10 weight-400 border-b'>
           
    
                <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>Shipping Policy:
                        {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['5_shipping_and_delivery'].shipping_policy_reference}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Risk of Loss:{' '}
                        <span className='weight-400'>
                          {termsAndCondition.terms_and_conditions['5_shipping_and_delivery'].risk_of_loss}
                      </span>
                      </p>
    
                    </li>
           
    
           
                    
                  </ul>
                </div>
             
                
                <li className='weight-500 text-20 mt-10  mb-10'>
                Return and Delivery
            </li>
            
            <div className='pl-10 weight-400 border-b pb-10'>
            <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>Return Policy:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['6_returns_and_refunds'].return_policy_reference}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Limited License{' '}
                        <span className='weight-400'>
                          {termsAndCondition.terms_and_conditions['7_intellectual_property'].limited_license}
                      </span>
                      </p>
    
                    </li>
               
    
            
                  </ul>
    
    </div>
    
                <li className='weight-500 text-20 mt-10  mb-10'>
          Intellectual Property
                </li>
                <div className='pl-10 weight-400 border-b pb-10'>
          
    
                <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                    <li>
                      <p className='weight-600'>OwnerShip:
    {' '}
                      <span className='weight-400'>
    
                    {termsAndCondition.terms_and_conditions['7_intellectual_property'].ownership}
                      </span>
                      </p>
    
                    </li>
                    <li>
                      <p className='weight-600 mt-10'>Limited License{' '}
                        <span className='weight-400'>
                          {termsAndCondition.terms_and_conditions['7_intellectual_property'].limited_license}
                      </span>
                      </p>
    
                    </li>
               
    
            
                  </ul>
                </div>
             
                <li className='weight-500 text-20 mt-10  mb-10'>
                Limitation of Liability
                </li>
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                {termsAndCondition.terms_and_conditions['8_limitation_of_liability']}
                </div>
    
    
                <li className='weight-500 text-20 mt-10  mb-10'>
 Indemnification
                </li>
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                {termsAndCondition.terms_and_conditions['9_indemnification']}
                </div>
    
                <li className='weight-500 text-20 mt-10  mb-10'>
            Governing Law
                </li>
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                {termsAndCondition.terms_and_conditions['10_governing_law']}
                </div>
    
                <li className='weight-500 text-20 mt-10  mb-10'>
   Change to Terms
                </li>
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                {termsAndCondition.terms_and_conditions['11_changes_to_terms']}
                </div>
    
    
         
       
    
    
                <li className='weight-500 text-20 mt-10  mb-10'>
    Contact Us
                </li>
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                If you have any questions about these Terms, please contact us at:

                  
 
    
                </div>
                
                <div className='weight-400 pb-10 border-b mb-10 mt-10'>
         If you have questions, complaints, or requests regarding this policy or your 
                  personal data, please contact:
                  
                  <div className='weight-600 mt-5 mb-5'>Email: {contactEmail }</div>
                  <div className='weight-600 mt-5 mb-5'>Address: {termsAndCondition.terms_and_conditions['12_contact_us'].address}</div>
    
                </div>
          <p className='w-60p weight-400 mb-10 mt-10'>
            
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