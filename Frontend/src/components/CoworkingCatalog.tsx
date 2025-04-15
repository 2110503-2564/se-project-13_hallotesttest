"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "./Card";
import getDirectGoogleDriveUrl from "@/libs/getDirectGoogleDriveUrl";

export default function CoworkingCatalog() {
  const [coworkingData, setCoworkingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('https://deepseekxchatgpt-backend.vercel.app/api/v1/coworkings', {
          cache: 'no-store',
          headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          },
          next: { revalidate: 0 }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch coworking spaces');
        }
        
        const data = await response.json();
        setCoworkingData(data);
      } catch (err: any) {
        console.error('Error fetching coworking spaces:', err);
        setError(err.message || 'Failed to load coworking spaces');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <p className="text-xl text-white mt-6">Loading coworking spaces...</p>
      </div>
    );
  }

  if (error || !coworkingData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <p className="text-xl text-white text-center">
          {error || "Failed to load coworking spaces"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-8">
        {coworkingData.count} Available Coworking Spaces
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {coworkingData.data.map((coworkingItem: CoworkingItem) => (
          <Link 
            key={coworkingItem._id} 
            href={`/coworking/${coworkingItem._id}`} 
            className="transform transition-all duration-300 hover:scale-105"
          >
            <Card 
              coworkingName={coworkingItem.name} 
              imgSrc={getDirectGoogleDriveUrl(coworkingItem.picture)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}