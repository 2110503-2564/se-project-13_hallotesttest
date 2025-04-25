"use client";

import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useSession } from "next-auth/react";
import editReview from "@/libs/editReview";
import deleteReview from "@/libs/deleteReview";
import NotiPopup from "./NotiPopup";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function EditReviewCard({ review }: { review: RatingItem }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number>(review.rating);
  const [comment, setComment] = useState<string>(review.comment);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await editReview(
        review._id,
        rating,
        comment,
        session?.user.token || ""
      ).then((res) => {
        console.log("Review updated successfully:", res);
      });
      setPopupTitle("Success");
      setPopupMessage("Review updated successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating review:", error);
      setPopupTitle("Error");
      setPopupMessage("" + error);
      setShowPopup(true);
    }
  };

  const handleDeleteClick = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      const res = await deleteReview(
        review._id,
        session?.user.token || ""
      ).catch((error) => {
        console.error("Error deleting review:", error);
      });
      setPopupTitle("Success");
      setPopupType("Success");
      setPopupMessage("Review deleted successfully!");
      setShowPopup(true);
    } catch (error) {
      setPopupTitle("Error");
      setPopupType("Error");
      setPopupMessage("" + error);
      setShowPopup(true);
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

      <div className="relative">
        <textarea
          placeholder="Your comment..."
          className="w-full rounded-lg bg-white/40 resize-none placeholder-gray-500 outline-none text-white shadow-lg p-3 pr-16"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={200}
        />
        <p className="absolute bottom-3 right-3 text-sm text-gray-300">
          {comment.length}/200
        </p>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <AccountCircle sx={{ color: "white", fontSize: 40 }} />
            {session?.user?.username ? (
              <span className="text-white ml-2 font-semibold">
                Feedback by : {session.user.username}
              </span>
            ) : (
              <span className="text-white ml-2">Anonymous</span>
            )}
          </div>
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
          <button
            className="w-[100px] shadow-xl py-2 bg-white/10 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
      {showConfirm && (
        <NotiPopup
          message="Are you sure you want to delete this review?"
          title="Confirm Delete"
          type="warning"
          onClose={() => setShowConfirm(false)}
          onSubmit={handleConfirmDelete}
        />
      )}
      {showPopup && (
        <NotiPopup
          message={popupMessage}
          title={popupTitle}
          type={popupTitle}
          onClose={() => {
            setShowPopup(false);
            window.location.reload();
            // if(popupTitle === "Success") {
            //   window.location.reload();
            // }
          }}
        />
      )}
    </div>
  );
}
