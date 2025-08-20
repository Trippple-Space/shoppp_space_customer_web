import { TermsAndConditionsJson } from '@/modules/lib/utility/types/legal-types/terms.condition.interface';
import termsAndCondition from '../../../../lib/utility/json-data/legal/t&c.json'
import React from 'react'
import { contactEmail } from '@/modules/lib/utility/utility';

function ShippingPolicy() {
  const TermsAndConditionJson:TermsAndConditionsJson = termsAndCondition;

  return (
    <>      <div className='flex flex-col a-items-center'>
        

      
        <h1 className='text-24 l:text-36 line-height-40 my-15 weight-700 text-dimgrey pt-5 l:pt-30  border-3 border-b pb-5 '>Shipping Policy</h1>
      
      </div>
      
      

       <div className='p-20 flex flex-col a-items-center'>
        <div className='l:w-60p'>
          

        <div className='weight-400 pb-10 border-b mt-10 mb-10'>
                 {termsAndCondition.schedule_1_shipping_policy.shipping_introduction}
           
                 </div>
               
             <ol className='pb-10 border-b'>
                 <li className='weight-500 text-20'>
          Shipping Location
                 </li>
                 <div className='weight-400 pb-10 border-b mt-10 mb-10'>
                 {termsAndCondition.schedule_1_shipping_policy['1_shipping_locations']}
           
                 </div>
     
                 <li className='weight-500 text-20'>
                 Processing Time
                 </li>
     
                 <div className='pl-10 weight-400 border-b pb-10'>
           
     
                   <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                     <li>
           
     {' '}
                  <p className='weight-400'>
                    
    {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][0].split('1-3 business days')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>1-3 business days</span>
              {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][0].split('1-3 business days')[1]}
     
                     {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][1]}
                       </p>
     
     
                     </li>
                     <li>
           
     {' '}
                       <p className='weight-400'>
     
                     {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][1]}
                       </p>
     
     
                     </li>
             
        
     
   
                     
                   </ul>
                
                 </div>
     
                 <li className='weight-500 text-20 mt-10  mb-10'>
Delivery Time                 </li>
             <div className='pl-10 weight-400 border-b pb-10'>
           
     
                   <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                     <li>
                       <p className='weight-600'>Lagos State:
     {' '}
                       <span className='weight-400'>
     
                 
                      
                   
            {termsAndCondition.schedule_1_shipping_policy['3_delivery_time'].lagos_state.split('1-2 business days')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>1-2 business days</span>
              {termsAndCondition.schedule_1_shipping_policy['3_delivery_time'].lagos_state.split('1-2 business days')[1]}
         

                       </span>
                       </p>
     
                </li>
              </ul>
                
                 </div>
     
                 <li className='weight-500 text-20 mt-10  mb-10'>
                 Shipping Cost
                 </li>
                 <div className='pl-10 weight-400 border-b pb-10'>
             
     
                 <ul className='pl-10 p-5' style={{ listStyleType: 'disc' }}>
                     <li>
            
     {' '}
                       <p className='weight-400'>
      {termsAndCondition.schedule_1_shipping_policy['4_shipping_costs']}
                       </p>
          
     
                     </li>
       
                   </ul>
                 </div>
              
                 <li className='weight-500 text-20 mt-10  mb-10'>
              Order Tracking
            </li>

         <div className='weight-400 pb-10 border-b mt-10 mb-10'>
                 {termsAndCondition.schedule_1_shipping_policy['5_order_tracking']}
           
                 </div>

            
                 
                 <li className='weight-500 text-20 mt-10  mb-10'>
         Failed Deliveries
             </li>
             
             <div className='weight-400 pb-10 border-b mt-10 mb-10'>
                 {termsAndCondition.schedule_1_shipping_policy['6_failed_deliveries']}
           
                 </div>
     
         

              
        
     
            
     
            
           
     
          
        
     
     
                 <li className='weight-500 text-20 mt-10  mb-10'>
     Contact Us
                 </li>
                 <div className='weight-500 pb-10  mb-10 mt-10'>
                 For shipping inquiries, please contact our Customer Service team:
                 </div>
                 
                 <div className='weight-400 pb-10 border-b mb-10 mt-10'>
                   <div className='weight-600 mt-5 mb-5'>Email: {contactEmail }</div>
                   <div className='weight-600 mt-5 mb-5'>Phone: {termsAndCondition.schedule_1_shipping_policy['7_contact_us'].phone}</div>
     
            </div>
            <p className='weight-500 text-20 mt-10  mb-10'>
Return Policy
                 </p>
           <p className='weight-400 mb-10 mt-10'>
             
 {termsAndCondition.return_policy.description}
             </p>
               </ol>
             </div>
     
               
     
 
         
           </div>
     
    </>
  )
}

export default ShippingPolicy