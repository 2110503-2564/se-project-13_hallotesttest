export default function ReviewsCard({review} : {review : RatingItem}){
    return (
        <main>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-4">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    {review.UserId}
                </h1>
                <p className="text-sm opacity-80">Rating</p>
                <p className="font-medium">{review.rating}</p>
                <p className="text-sm opacity-80">Comment</p>
                <p className="font-medium">{review.comment}</p>
            </div>
        </main>
    )
}