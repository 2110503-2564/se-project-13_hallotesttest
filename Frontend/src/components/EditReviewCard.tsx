"use client";

import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useSession } from "next-auth/react";
import editReview from "@/libs/editReview";

export default function EditReviewCard({ review }: { review: RatingItem }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(review.rating);
  const [comment, setComment] = useState<string>(review.comment);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await editReview(review._id, rating, comment, session?.user.token || "")
        .then((res) => {
          console.log("Review updated successfully:", res);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating review:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full mx-auto mt-4 p-6 rounded-2xl bg-white/30 shadow-lg text-white space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Update Your Feedback</h2>
        <Rating
          name="feedback-rating"
          value={rating}
          onChange={(e, newValue) => {
            setRating(newValue || 0);
          }}
          size="large"
        />
      </div>

      <textarea
        className="w-full p-3 rounded-xl bg-purple-300 bg-opacity-40 text-white placeholder-white focus:outline-none resize-none"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white text-purple-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
              />
            </svg>
          </div>
          <span className="text-white">
            Feedback by : {session?.user.username}
          </span>
        </div>
        <div className="ml-auto space-x-2">
          <button
            className="w-[100px] shadow-xl py-2 bg-white/10 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
            onClick={(e) => {
              handleUpdate(e);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            Update
          </button>
          <button className="w-[100px] shadow-xl py-2 bg-white/10 hover:bg-white/30 rounded-lg text-white font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
