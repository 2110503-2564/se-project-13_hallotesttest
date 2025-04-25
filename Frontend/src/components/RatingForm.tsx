"use client";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useSession } from "next-auth/react";
import createRating from "@/libs/createRating";
import NotiPopup from "@/components/NotiPopup";
import { useRouter } from "next/navigation";

export default function RatingForm({ cid }: { cid: string }) {
  const router = useRouter();
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [titleMessage, setTitleMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { data: session } = useSession();
  const [popupType, setPopupType] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await createRating({
        rating: ratingValue,
        comment: comment,
        token: session?.user?.token || "",
        cid: cid,
      });
      setRatingValue(0);
      setComment("");
      setTitleMessage("Success");
      setPopupType("Success");
      setPopupMessage("Rating submitted successfully!");
      setShowPopup(true);
      router.refresh();
    } catch (err) {
      setTitleMessage("Error");
      setPopupType("Error");
      setPopupMessage("" + err);
      setShowPopup(true);
    }
  };

  return (
    <main className="w-full bg-white/10 rounded-2xl mt-4">
      {showPopup && (
        <NotiPopup
          message={popupMessage}
          title={titleMessage}
          type={popupType}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="flex flex-col rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-white text-2xl">Write Your Feedback</h2>
          <Rating
            name="co-working rating"
            size="large"
            value={ratingValue}
            onChange={(e, newValue) => {
              setRatingValue(newValue || 0);
            }}
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
        <div className="flex justify-between items-center mt-6">
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
          <button
            className="w-[50%] shadow-xl py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}
