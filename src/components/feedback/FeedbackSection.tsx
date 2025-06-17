import React, { useState, useEffect } from "react";
import { Flag, Star, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import { ReportModal } from "../report/ReportModel";

interface Feedback {
    _id: string;
    customerId: {
        username: string;
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
    const [isLoading, setIsLoading] = useState(true);
    const [reportModal, setReportModal] = useState<{
        isOpen: boolean;
        targetId: string;
        targetName: string;
    }>({
        isOpen: false,
        targetId: "",
        targetName: "",
    });

    const handleReportUser = (userId: string, userName: string) => {
        setReportModal({
            isOpen: true,
            targetId: userId,
            targetName: userName,
        });
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [storeId]);

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(
                ApiConstants.GET_STORE_FEEDBACK(storeId)
            );
            setFeedbacks(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.feedbacks || []
            );
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            toast.error("Failed to load feedbacks");
        } finally {
            setIsLoading(false);
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
                    <button
                        type={interactive ? "button" : undefined}
                        key={star}
                        className={`transition-all duration-200 ${
                            interactive
                                ? "cursor-pointer hover:scale-110 active:scale-95"
                                : ""
                        }`}
                        onMouseEnter={() =>
                            interactive && setHoveredRating(star)
                        }
                        onMouseLeave={() => interactive && setHoveredRating(0)}
                        onClick={() => interactive && setRating(star)}
                    >
                        {star <= (hoveredRating || value) ? (
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                            <Star className="w-5 h-5 text-gray-300" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Feedback Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Share Your Experience
                </h2>
                {!hasPayment && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                        <p className="text-amber-700 text-sm font-medium">
                            You need to make a payment before leaving feedback.
                        </p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            How would you rate your experience?
                        </label>
                        <div className="flex items-center gap-2">
                            {renderStars(rating, true)}
                            <span className="text-sm text-gray-500 ml-2">
                                {rating > 0
                                    ? `${rating} star${rating > 1 ? "s" : ""}`
                                    : "Not rated"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Your feedback
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like or dislike? How was your overall experience?"
                            className="w-full min-h-[120px] border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || !hasPayment}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            "Submit Feedback"
                        )}
                    </Button>
                </form>
            </div>

            {/* Feedback List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Customer Reviews
                    </h2>
                    <div className="flex items-center">
                        {feedbacks.length > 0 && (
                            <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 fill-indigo-400 text-indigo-400 mr-1" />
                                <span className="text-sm font-medium text-indigo-700">
                                    {(
                                        feedbacks.reduce(
                                            (acc, curr) => acc + curr.rating,
                                            0
                                        ) / feedbacks.length
                                    ).toFixed(1)}
                                </span>
                                <span className="text-xs text-indigo-500 ml-1">
                                    ({feedbacks.length} reviews)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Star className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">
                            No reviews yet
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="flex gap-4 pb-6 last:pb-0 border-b border-gray-100 last:border-b-0 group"
                            >
                                <div className="flex-shrink-0">
                                    <div className="bg-indigo-100 rounded-full p-3 group-hover:bg-indigo-200 transition-colors">
                                        <UserIcon className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {feedback.customerId.username}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(
                                                    feedback.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {renderStars(feedback.rating)}
                                            <span className="text-sm text-gray-500 ml-1">
                                                {feedback.rating}.0
                                            </span>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleReportUser(
                                                        feedback._id,
                                                        feedback.customerId
                                                            .username
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                                            >
                                                <Flag className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {feedback.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={reportModal.isOpen}
                onClose={() =>
                    setReportModal({
                        isOpen: false,
                        targetId: "",
                        targetName: "",
                    })
                }
                targetId={reportModal.targetId}
                targetName={reportModal.targetName}
                targetType="user"
                reporterType="shop"
                reporterName="Shop Owner" // This would come from shop context
            />
        </div>
    );
};
