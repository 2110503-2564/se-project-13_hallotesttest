'use client'
import { useState } from "react";
import Rating from '@mui/material/Rating';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSession } from "next-auth/react";
import createRating from "@/libs/createRating";

export default function RatingForm({cid} : {cid : string}) {

    const [ratingValue, setRatingValue] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const {data : session} = useSession();

    const handleSubmit = async () => {
        try {
            const res = await createRating({
                rating: ratingValue,
                comment: comment,
                token: session?.user?.token || '',
                cid: cid
            });
            setRatingValue(0);
            setComment('');
        } catch(err) {
            alert(err);
            console.error("Failed to submit rating:", err);
        }
    }

    return (
        <main className="w-full bg-white/10 rounded-2xl mt-4">
            
            <div className="flex flex-col rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-white text-2xl">Write Your Feedback</h2>
                    <Rating
                        name="co-working rating"
                        size="large"
                        value={ratingValue}
                        onChange={(e, newValue) => {
                            setRatingValue(newValue ? newValue : 0);
                        }}
                    />
                </div>
                <textarea
                    placeholder="Your comment..."
                    className="w-full rounded-lg bg-white/40 resize-none placeholder-gray-500 outline-none text-white shadow-lg"
                    rows={4}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-between items-center mt-6 ">
                    <div className="flex items-center">
                       <AccountCircle 
                        sx={{ color: 'action.active', fontSize: 40 }} 
                        />
                        {
                            session?.user?.username ? (
                                <span className="text-white ml-2 text-semibold">Feedback by : {session.user.username}</span>
                            ) : (
                                <span className="text-white ml-2">Anonymous</span>
                            )
                        }

                    </div>
                    <button
                        className="w-[50%] shadow-xl py-2  bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                
            </div>
        </main>
    );
}
