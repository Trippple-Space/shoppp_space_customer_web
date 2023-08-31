import React from 'react'
import { BiHomeAlt2 } from 'react-icons/bi'
import BaseCategoryNav, { ICategoryNavOption } from './BaseCategoryNav'

const options: ICategoryNavOption[] = [
    {
        iconSrc: 'home.svg',
        label: 'All',
        padding: '7px'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    }
    ,
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366944/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.18_PM_wbawin.jpg',
        label: 'Senator'
    },
    {
        iconSrc: 'https://res.cloudinary.com/codennerd/image/upload/v1680366942/Asoebi%20Africa/WhatsApp_Image_2023-04-01_at_5.29.15_PM_4_spqlv2.jpg',
        label: 'Linen'
    }
]

const HomepageCategoryNav = () => {
    return (
        <div className=''>
            <BaseCategoryNav options={options} displayFilter={false} />
        </div>
    )
}

export default HomepageCategoryNav