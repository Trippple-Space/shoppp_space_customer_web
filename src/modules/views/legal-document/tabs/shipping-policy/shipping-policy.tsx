import { TermsAndConditionsJson } from '@/modules/lib/utility/types/legal-types/terms.condition.interface';
import termsAndCondition from '../../../../lib/utility/json-data/legal/t&c.json'
import React from 'react'
import { contactEmail } from '@/modules/lib/utility/utility';

function ShippingPolicy() {
  const TermsAndConditionJson:TermsAndConditionsJson = termsAndCondition;

  return (
    <>      <div className='flex flex-col items-center'>
        

      
        <h1 className='text-[24px] lg:text-[36px] leading-[40px] my-[15px] font-bold text-[#333333] pt-[5px] lg:pt-[30px]  border-[3px] border-b pb-[5px] '>Shipping Policy</h1>
      
      </div>
      
      

       <div className='p-[20px] flex flex-col items-center'>
        <div className='lg:w-[60%]'>
          

        <div className='font-normal pb-[10px] border-b mt-[10px] mb-[10px]'>
                 {termsAndCondition.schedule_1_shipping_policy.shipping_introduction}
           
                 </div>
               
             <ol className='pb-[10px] border-b'>
                 <li className='font-medium text-[20px]'>
          Shipping Location
                 </li>
                 <div className='font-normal pb-[10px] border-b mt-[10px] mb-[10px]'>
                 {termsAndCondition.schedule_1_shipping_policy['1_shipping_locations']}
           
                 </div>
     
                 <li className='font-medium text-[20px]'>
                 Processing Time
                 </li>
     
                 <div className='pl-[10px] font-normal border-b pb-[10px]'>
           
     
                   <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                     <li>
           
     {' '}
                  <p className='font-normal'>
                    
    {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][0].split('1-3 business days')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>1-3 business days</span>
              {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][0].split('1-3 business days')[1]}
     
                     {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][1]}
                       </p>
     
     
                     </li>
                     <li>
           
     {' '}
                       <p className='font-normal'>
     
                     {termsAndCondition.schedule_1_shipping_policy['2_processing_time'][1]}
                       </p>
     
     
                     </li>
             
        
     
   
                     
                   </ul>
                
                 </div>
     
                 <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
Delivery Time                 </li>
             <div className='pl-[10px] font-normal border-b pb-[10px]'>
           
     
                   <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                     <li>
                       <p className='font-semibold'>Lagos State:
     {' '}
                       <span className='font-normal'>
     
                 
                      
                   
            {termsAndCondition.schedule_1_shipping_policy['3_delivery_time'].lagos_state.split('1-2 business days')[0]}
              <span style={{ fontWeight: 600, color: '#333' }}>1-2 business days</span>
              {termsAndCondition.schedule_1_shipping_policy['3_delivery_time'].lagos_state.split('1-2 business days')[1]}
         

                       </span>
                       </p>
     
                </li>
              </ul>
                
                 </div>
     
                 <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
                 Shipping Cost
                 </li>
                 <div className='pl-[10px] font-normal border-b pb-[10px]'>
             
     
                 <ul className='pl-[10px] p-[5px]' style={{ listStyleType: 'disc' }}>
                     <li>
            
     {' '}
                       <p className='font-normal'>
      {termsAndCondition.schedule_1_shipping_policy['4_shipping_costs']}
                       </p>
          
     
                     </li>
       
                   </ul>
                 </div>
              
                 <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
              Order Tracking
            </li>

         <div className='font-normal pb-[10px] border-b mt-[10px] mb-[10px]'>
                 {termsAndCondition.schedule_1_shipping_policy['5_order_tracking']}
           
                 </div>

            
                 
                 <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
         Failed Deliveries
             </li>
             
             <div className='font-normal pb-[10px] border-b mt-[10px] mb-[10px]'>
                 {termsAndCondition.schedule_1_shipping_policy['6_failed_deliveries']}
           
                 </div>
     
         

              
        
     
            
     
            
           
     
          
        
     
     
                 <li className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
     Contact Us
                 </li>
                 <div className='font-medium pb-[10px]  mb-[10px] mt-[10px]'>
                 For shipping inquiries, please contact our Customer Service team:
                 </div>
                 
                 <div className='font-normal pb-[10px] border-b mb-[10px] mt-[10px]'>
                   <div className='font-semibold mt-[5px] mb-[5px]'>Email: {contactEmail }</div>
                   <div className='font-semibold mt-[5px] mb-[5px]'>Phone: {termsAndCondition.schedule_1_shipping_policy['7_contact_us'].phone}</div>
     
            </div>
            <p className='font-medium text-[20px] mt-[10px]  mb-[10px]'>
Return Policy
                 </p>
           <p className='font-normal mb-[10px] mt-[10px]'>
             
 {termsAndCondition.return_policy.description}
             </p>
               </ol>
             </div>
     
               
     
 
         
           </div>
     
    </>
  )
}

export default ShippingPolicy