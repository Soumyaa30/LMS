import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-[#7BB1D8]/80 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.logo} alt="logo" className='w-28'/>
          <p className='mt-6 text-center md:text-left text-sm'>Zyphor Vexum sit amet, cursus vel sapien id, fermentum ultricies metus. Pellentesque habitant morbi tristique senectus et netus.</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold mb-5'>Company</h2>
          <ul className='flex flex-col w-full justify-between text-sm md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className='flex flex-col items-start w-full'>
          <h2 className='font-semibold mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm'>The latest news, articles, and resources sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
        <input type="email" placeholder='Enter your email' 
        className='border border-gray-500/30 bg-white text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'/>
        <button className='bg-[#7A2048]/90 w-24 h-9 text-white rounded'>Subscribe</button>
      </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm'>Copyright 2025 @ ABC. All Rights Reserved.</p>
      
    </footer>
  )
}

export default Footer
