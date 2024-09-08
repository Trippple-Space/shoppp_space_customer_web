import React from 'react';
import { cx } from '../../utility/utility';

const SkeletonLoader = ({className = '', ...props}) => {
  return (
    // animate-skeleton
    <div className={cx("flex flex-col w-full h-full bg-grey-300 animate-pulse", className)} {...props}>
    </div>
  );
};

export default SkeletonLoader;
