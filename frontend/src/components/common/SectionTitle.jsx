import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const SectionTitle = ({ title, lable, link }) => {
  return (
    <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
      <h2 className='text-2xl md:text-3xl font-bold text-heading'>{title}</h2>
      {lable && link && (
        <Link 
          to={link} 
          className='flex items-center gap-1 text-sm md:text-base font-medium text-heading2 hover:text-primery duration-300'
        >
          <span>{lable}</span>
          <IoIosArrowForward className='text-sm' />
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
