import { cx } from '@/modules/lib/utility/utility'
import Link from 'next/link'
import React, { FC } from 'react'
import { TfiAngleRight } from 'react-icons/tfi'

// const crumbs = [
//     { label: 'Home', route: '/' },
//     { label: 'Decoration', route: '/' },
//     { label: 'Furniture', route: '/' },
//     { label: 'Storage', route: '/' },
//     { label: 'Sideboard', route: null },
// ]

interface IBreadcrumb {
    crumbs: {
        label: string,
        route: string
    }[]
}

const Breadcrumb: FC<IBreadcrumb> = ({ crumbs }) => {
    return (
        crumbs.length ? <div className="breadcrumb lg:block hidden">
            <div className="flex a-content-center justify-center w-fit bg-brand-tint px-[12px] py-[8px] gap-[14px] rounded-[8px] whitespace-nowrap">
                {crumbs.map((crumb, i) => (
                    <span className='flex a-content-center justify-center gap-[14px] first-letter:!uppercase' key={i}>
                        <Link href={crumb.route.toLowerCase()} className={cx('text-[14px] text-brand first-letter:!uppercase', {
                            'font-bold text-brand': i === crumbs.length - 1
                        })}>
                            {crumb.label}
                        </Link>
                        {
                            i < crumbs.length - 1 &&
                            <TfiAngleRight className='h-[10px] self-center text-brand' />
                        }
                    </span>
                ))}
            </div>

        </div> : null
    )
}

export default Breadcrumb