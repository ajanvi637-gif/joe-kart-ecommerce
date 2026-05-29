import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => {
    const [mainImg, setMainImg] = useState(images[0]?.url)

    return (
        <div className='flex gap-5'>

            {/* Thumbnail Images */}
            <div className='flex flex-col gap-5'>
                {
                    images.map((img, index) => (
                        <img
                            key={index}
                            src={img.url}
                            alt=""
                            onClick={() => setMainImg(img.url)}
                            className='cursor-pointer w-20 h-20 border shadow-lg object-cover'
                        />
                    ))}
            </div>

            {/* Main Image */}
            <div>
                <Zoom>
                    <img
                        src={mainImg}
                        alt="Main Product"
                        className='w-100 h-100 object-cover border shadow-lg'
                    />
                </Zoom>
            </div>

        </div>
    )
}

export default ProductImg