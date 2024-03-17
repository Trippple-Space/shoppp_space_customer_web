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
        crumbs.length ? <div className="breadcrumb">
            <div className="flex a-content-center j-content-center w-fit bg-green-50 px-12 py-8 gap-14 radius-8">
                {crumbs.map((crumb, i) => (
                    <span className='flex a-content-center j-content-center gap-14 first-letter:uppercase!'>
                        <Link href={crumb.route.toLowerCase()} className={cx('text-14 @lo:text-green-300 first-letter:uppercase!', {
                            'bold @hi:text-green': i === crumbs.length - 1
                        })}>
                            {crumb.label}
                        </Link>
                        {
                            i < crumbs.length - 1 &&
                            <TfiAngleRight className='h-10 a-self-center text-green-300' />
                        }
                    </span>
                ))}
            </div>

        </div> : null
    )
}

export default Breadcrumb