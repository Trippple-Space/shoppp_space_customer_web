'use client';

import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

const getPages = (current: number, total: number) => {
  const delta = 1;
  const range: (number | '...')[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');

  if (total > 1) range.push(total);

  return range;
};

const StorePagination: React.FC<Props> = ({
  page,
  totalPages,
  onPageChange,
  loading,
}) => {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <div className="flex j-content-center mt-40">
      <div
        className="flex j-content-center a-items-center gap-8 px-14 py-10 bg-#fff radius-999"
        style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
      >
        <button
          className={`flex a-items-center gap-6 min-w-36 h-36 px-12 mr-8 border-none bg-white pointer text-14 g|transition-property:all g|transition-duration:0.2s hover:bg-#f5f5f5 ${page === 1 || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          <FaArrowLeft /> Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={i} className="py-6 text-#999">
              …
            </span>
          ) : (
            <button
              key={i}
              disabled={loading}
              className={`min-w-36 h-36 px-12 border border-solid border-#eee bg-white pointer text-14 g|transition-property:all g|transition-duration:0.2s ${p === page ? 'bg-#111 text-white border-#111' : 'hover:bg-#f5f5f5'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`flex a-items-center gap-6 min-w-36 h-36 px-12 ml-8 border-none bg-white pointer text-14 g|transition-property:all g|transition-duration:0.2s hover:bg-#f5f5f5 ${page === totalPages || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={page === totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default StorePagination;
