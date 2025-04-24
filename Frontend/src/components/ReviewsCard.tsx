import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';

export default function ReviewsCard({review} : {review : RatingItem}){
    return (
        <main>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl transition-transform hover:scale-105 duration-300">
                <div className="flex justify-between items-center mb-1">
                    <h1 className="text-2xl font-bold text-white">
                        {review.UserId.name}
                    </h1>
                    <div className="flex items-center">
                        {/* MUI star rating display with hover effect */}
                        {Array.from({ length: 5 }).map((_, i) =>
                            i < review.rating ? (
                                <Star
                                    key={i}
                                    className="text-yellow-400 transition-transform hover:scale-125 cursor-pointer"
                                    fontSize="medium"
                                />
                            ) : (
                                <StarBorder
                                    key={i}
                                    className="text-yellow-400 transition-transform hover:scale-125 cursor-pointer"
                                    fontSize="medium"
                                />
                            )
                        )}
                    </div>
                </div>
                <div>
                    <p className="font-medium text-white break-words">{review.comment}</p>
                </div>
            </div>
        </main>
    )
}