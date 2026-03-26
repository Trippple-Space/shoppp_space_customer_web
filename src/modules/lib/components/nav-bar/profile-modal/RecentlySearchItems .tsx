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
          <div className="text-16 weight-400 text-grey-700 h-full">
            {recentSearched.length === 0 ? (
              <div className='h-full flex flex-col a-items-center j-content-center'>
                <NoResultMessage textContent="Continue shopping to discover our best deals!" />
              </div>
            ) : (
              recentSearched.map((recentVariant) => (
                <div className="pb-20 mb-20 border-b border-1 border-grey-300">
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
              className="bg-white z-5 w-100p"
              style={{
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
            >
              <div className="flex space-between items-center  px-48   border-b border-1 border-grey-300 text-18 weight-400 text-grey-700">
                <div
                  className={`py-20 pointer w-fit ${action == 'open-orders' && 'text-green border-b border-2 border-green'}`}
                  onClick={() => setAction('open-orders')}
                >
                  Recently searched
                </div>
              </div>
            </div>
            <div
              className="p-20 overflow-auto no-scrollbar"
              style={{ height: 'calc(100dvh - 230px)' }}
            >
              <div className="h-full">{selected(action)}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-#00000014">
          <div className="p-20 flex gap-10 a-items-center j-content-end bg w-full">
            <button
              className="px-25 py-10 radius-6 outline-none border-1 weight-500 bg-none color-black cursor-pointer"
              onClick={handleCloseModal}
            >
              Close
            </button>

            {recentSearched.length > 0 && (
              <button
                className="px-25 py-10 radius-6 outline-none border-none bg-#D4280C color-white cursor-pointer"
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
