import Image from 'next/image'
import getCoworking from '@/libs/getCoworking'
import Link from 'next/link'
import getDirectGoogleDriveUrl from '@/libs/getDirectGoogleDriveUrl'
import RatingForm from '@/components/RatingForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { get } from 'http'
import getCoworkingRating from '@/libs/getCoworkingRating'
import ReviewsCard from '@/components/ReviewsCard'


export default async function CardDetailPage({params} : {params : {cid : string}}) {

    const coworkingDetail = await getCoworking(params.cid)
    const session = await getServerSession(authOptions);
    const reviews = await getCoworkingRating(params.cid);

    return (
        <main className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 min-h-screen py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        {coworkingDetail.data.name}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        {/* Image container with matching height */}
                        <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden shadow-lg h-auto min-h-[400px]">
                            <Image 
                                src={getDirectGoogleDriveUrl(coworkingDetail.data.picture)}
                                alt={`${coworkingDetail.data.name} Picture`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Details container with matching height */}
                        <div className="w-full md:w-1/2 text-white flex flex-col h-auto min-h-[400px]">
                            <div className="bg-white/20 rounded-xl p-6 shadow-lg flex-grow">
                                <h2 className="text-xl font-semibold border-b border-white/30 pb-2 mb-4">
                                    Details
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm opacity-80">Full Address</p>
                                        <p className="font-medium">
                                            {coworkingDetail.data.address}, {coworkingDetail.data.district}, {coworkingDetail.data.province}, {coworkingDetail.data.postalcode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Available Time</p>
                                        <p className="font-medium">
                                            {coworkingDetail.data.time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-80">Contact</p>
                                        <p className="font-medium">
                                            {coworkingDetail.data.tel}
                                        </p>
                                    </div>                            
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <Link 
                                    href="/coworking" 
                                    className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                                >
                                    Back to All Spaces
                                </Link>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                {
                    session ? <RatingForm cid={params.cid}/> : ""
                }
                {
                    reviews && reviews.data && Array.isArray(reviews.data) && 
                    reviews.data.map((review : RatingItem) => (
                        <div key={review._id} className="mt-6">
                            <ReviewsCard review={review}/>
                        </div>
                    )) 
                }
            </div>
        </main>
    )
}