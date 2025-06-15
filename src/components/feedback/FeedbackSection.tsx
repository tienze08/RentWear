import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";

interface Feedback {
  _id: string;
  customerId: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface FeedbackSectionProps {
  storeId: string;
  hasPayment: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  storeId,
  hasPayment,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  useEffect(() => {
    fetchFeedbacks();
  }, [storeId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstance.get(
        ApiConstants.GET_STORE_FEEDBACK(storeId)
      );
      console.log("response", response.data);
      setFeedbacks(Array.isArray(response.data) ? response.data : response.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPayment) {
      toast.error("You need to make a payment before leaving feedback");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(ApiConstants.FEEDBACK, {
        storeId,
        rating,
        comment,
      });
      toast.success("Feedback submitted successfully");
      setRating(0);
      setComment("");
      fetchFeedbacks();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit feedback";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`cursor-pointer ${
              interactive ? "hover:scale-110 transition-transform" : ""
            }`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
          >
            {star <= (hoveredRating || value) ? (
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="w-5 h-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Leave Feedback</h2>
        {!hasPayment && (
          <p className="text-red-500 mb-4">
            You need to make a payment to this store before leaving feedback
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            {renderStars(rating, true)}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this store..."
              className="w-full"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !hasPayment}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{feedback.customerId.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
