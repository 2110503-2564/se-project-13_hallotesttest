'use client'
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import { Rating } from '@mui/material';
import { useState } from "react";

export default function Card({ coworkingName, imgSrc, onRating }: { coworkingName: string, imgSrc: string, onRating?: Function }) {
  const [value, setValue] = useState<number | null>(0);

  return (
    <InteractiveCard>
      <div className="w-full h-60 relative overflow-hidden rounded-t-xl">
        <Image 
          src={imgSrc} 
          alt="Co-Working Picture" 
          fill
          className="object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
        />
      </div>
      <div className="w-full h-20 p-4 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-100 rounded-b-xl">
        <p className="text-lg font-semibold text-indigo-900 mb-2">{coworkingName}</p>
        {onRating && (
          <Rating 
            name={`${coworkingName} Rating`} 
            id={`${coworkingName} Rating`} 
            data-testid={`${coworkingName} Rating`} 
            value={value}
            onChange={(event, newValue) => {
              event.stopPropagation();
              setValue(newValue);
              onRating(coworkingName, newValue);
            }}
            onClick={(event) => event.stopPropagation()}
          />
        )}
      </div>
    </InteractiveCard>
  )
}