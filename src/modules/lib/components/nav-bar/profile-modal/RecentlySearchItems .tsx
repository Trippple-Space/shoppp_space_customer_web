'use client';

import Modal from '@/modules/lib/components/modal/modal';
import React, { useState } from 'react';
import SavedItemCard from '../../save-item-card/SavedItemCard';
import {
  useRecentlyViewedActions,
  useRecentlyViewedVariant,
} from '@/modules/lib/utility/hooks/use-recently-viewed';
import Image from '../../image/Image';
import NoResultMessage from '../../error-messages/no-result-found';

interface ModalProps {
  modalOpen: boolean;
  handleCloseModal: () => void;
  data: any;
}

const RecentlySearchItems: React.FC<ModalProps> = ({
  modalOpen,
  handleCloseModal,
}) => {
  const [action, setAction] = useState('open-orders');
  const { recentSearched } = useRecentlyViewedVariant();
  const { clearRecentVariants } = useRecentlyViewedActions();

  const selected = (option: any) => {
    switch (option) {
      case 'open-orders':
        return (
          <div className="text-[16px] font-normal text-[#6B6662] h-full">
            {recentSearched.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center'>
                <NoResultMessage textContent="Continue shopping to discover our best deals!" />
              </div>
            ) : (
              recentSearched.map((recentVariant) => (
                <div className="pb-[20px] mb-[20px] border-b border border-[#E4E1DF]">
                  <SavedItemCard
                    recentVariant={recentVariant}
                    showRemove={false}
                  />
                </div>
              ))
            )}
          </div>
        );
    }
  };
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        extraClass={{
          overflow: 'hidden',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          height: 'calc(100dvh - 80px)',
          width: '90%',
          maxWidth: '800px',
        }}
      >
        <div className="relative w-full">
          <div className="w-full">
            <div
              className="bg-white z-[5px] w-full"
              style={{
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
            >
              <div className="flex justify-between items-center  px-[48px]   border-b border border-[#E4E1DF] text-[18px] font-normal text-[#6B6662]">
                <div
                  className={`py-[20px] cursor-pointer w-fit ${action == 'open-orders' && 'text-brand border-b border-[2px] border-brand'}`}
                  onClick={() => setAction('open-orders')}
                >
                  Recently searched
                </div>
              </div>
            </div>
            <div
              className="p-[20px] overflow-auto no-scrollbar"
              style={{ height: 'calc(100dvh - 230px)' }}
            >
              <div className="h-full">{selected(action)}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#00000014]">
          <div className="p-[20px] flex gap-[10px] items-center justify-end bg w-full">
            <button
              className="px-[25px] py-[10px] rounded-[6px] outline-none border font-medium bg-transparent text-black cursor-pointer"
              onClick={handleCloseModal}
            >
              Close
            </button>

            {recentSearched.length > 0 && (
              <button
                className="px-[25px] py-[10px] rounded-[6px] outline-none border-none bg-[#D4280C] text-white cursor-pointer"
                onClick={() => {
                  clearRecentVariants('search');
                }}
              >
                Clear recently searched
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentlySearchItems;
