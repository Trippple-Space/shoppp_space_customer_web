"use client"
import Footer from '@/modules/lib/components/footer/Footer'
import HomepageNavBar from '@/modules/lib/components/nav-bar/HomepageNavBar'
import React from 'react'
import Gallery from 'react-grid-gallery';
import Masonry from 'react-masonry-css';

const Explore = () => {
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
      };
    

      const images = [
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377581/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.38_AM_1_samhx5.jpg',
          caption: 'Photo 1'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.07_AM_2_tdqxwf.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.07_AM_2_tdqxwf.jpg',
          caption: 'Photo 2'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.04_AM_2_pbukkn.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.04_AM_2_pbukkn.jpg',
          caption: 'Photo 3'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377463/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.05_AM_hnms5f.jpg',
          caption: 'Photo 4'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_1_lagmdm.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_1_lagmdm.jpg',
          caption: 'Photo 5'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          caption: 'Photo 6'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          caption: 'Photo 7'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_ogr4wj.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.10_AM_ogr4wj.jpg',
          caption: 'Photo 8'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_ynbrho.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_ynbrho.jpg',
          caption: 'Photo 9'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_1_cyknhk.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377465/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.09_AM_1_cyknhk.jpg',
          caption: 'Photo 10'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_1_ke6sjp.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_1_ke6sjp.jpg',
          caption: 'Photo 11'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_ayzcab.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377466/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.11_AM_ayzcab.jpg',
          caption: 'Photo 12'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_1_kxeykx.jpg',
          caption: 'Photo 13'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.02_AM_wuuypa.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.02_AM_wuuypa.jpg',
          caption: 'Photo 14'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.01_AM_guag4i.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377462/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.01_AM_guag4i.jpg',
          caption: 'Photo 15'
        },
        {
          src: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          thumbnail: 'https://res.cloudinary.com/codennerd/image/upload/v1689377577/Asoebi%20Africa/WhatsApp_Image_2023-07-15_at_12.23.25_AM_mghle5.jpg',
          caption: 'Photo 16'
        },
    ];

    
  return (
    <div>
        <HomepageNavBar />
        <div className="app-width mb-100">
        <div className="photo-grid">
            {images.map((image, index) => (
                <div className="photo-item" key={index}>
                    <div className="photo-container">
                        <img src={image.src} alt={`Photo ${index + 1}`} />
                    </div>
                    {/* <div className="caption">{image.caption}</div> */}
                </div>
            ))}
            </div>
        </div>
        
        <Footer />  
    </div>
  )
}

export default Explore