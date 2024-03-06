import { cx } from '@/modules/lib/utility/utility'
import React from 'react'
import { TfiAngleRight } from 'react-icons/tfi'

const breadcrumb = [
    { label: 'Home', route: '/' },
    { label: 'Decoration', route: '/' },
    { label: 'Furniture', route: '/' },
    { label: 'Storage', route: '/' },
    { label: 'Sideboard', route: null },
]

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
    <div className="flex a-content-center j-content-center w-fit bg-#EDF0F8 px-12 py-8 gap-14 radius-8">
      {breadcrumb.map((crumb, i) => (
        <span className='flex a-content-center j-content-center gap-14'>
          <span className={cx('text-14 @lo:color-#A3A9C2', {
            'bold @hi:color-#3A4980': i === breadcrumb.length - 1
          })}>
            {crumb.label}
          </span>
          {
            i < breadcrumb.length - 1 &&
            <TfiAngleRight className='h-10 a-self-center color-#A3A9C2' />
          }
        </span>
      ))}
    </div>

  </div>
  )
}

export default Breadcrumb