import getcoworkings from '@/libs/getCoworkings';
import CoworkingCatalog from '@/components/CoworkingCatalog';
import { Suspense } from 'react';

export default function Coworking() {

  return (
    <main className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-md">
          Explore Coworking Spaces
        </h1>
        <p className="text-center text-white text-xl mb-12 max-w-3xl mx-auto">
          Find the perfect workspace for your needs from our curated selection
        </p>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-xl text-white mt-6">Discovering amazing spaces...</p>
          </div>
        }>
          <CoworkingCatalog/>
        </Suspense>
      </div>
    </main>
  );
}