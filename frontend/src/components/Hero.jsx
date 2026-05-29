import React from 'react'
import { Button } from './button'

const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-pink-50 via-rose-100 to-rose-200 py-16 min-h-[500px] ' >
            <div className='max-w-7xl mx-auto px-6'>
                <div className='grid md:grid-cols-2 gap-10 items-center'>

                    {/* LEFT CONTENT */}
                    <div className='space-y-6'>
                        <h1 className='text-4xl md:text-6xl font-extrabold leading-tight text-gray-900'>
                            Latest Electronics <br />
                            <span className='text-pink-600'>at Best Prices</span>
                        </h1>

                        <p className='text-lg md:text-xl text-gray-600 max-w-lg'>
                            Discover cutting-edge technology with unbeatable deals on
                            smartphones, laptops and more.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button className='bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition duration-300'>
                                Shop Now
                            </Button>

                            <Button
                                variant='outline'
                                className='border-2 border-pink-500 text-pink-600 px-6 py-3 rounded-full hover:bg-pink-500 hover:text-white transition duration-300'>
                                View Deals
                            </Button>
                        </div>
                    </div>


                    <div className='relative flex justify-center items-center group'>

                        {/* Ring */}
                        <div className='absolute w-64 h-64 md:w-80 md:h-80 border-4 border-pink-200 bg-pink-500 rounded-t-full  animate-pulse mt-15 '></div>

                        {/* Image */}
                        <img
                            src="/hero1.png"
                            className='relative w-full 
                                      max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
                                      transition duration-500 
                                      group-hover:scale-105 group-hover:-translate-y-2
                                     md:mr-[150px] lg:mr-[260px] 
                                      mt-10 md:mt-[60px] lg:mt-[91px]'
                            alt="hero"
                        />
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero