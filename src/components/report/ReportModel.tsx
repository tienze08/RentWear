import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Flag } from "lucide-react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetName: string;
    targetType: "user" | "shop";
    reporterType: "user" | "shop";
    reporterName: string;
}

export const ReportModal = ({
    isOpen,
    onClose,
    targetId,
    targetName,
    targetType,
    reporterType,
    reporterName,
}: ReportModalProps) => {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons =
        targetType === "shop"
            ? [
                  "Inappropriate content",
                  "Fake products",
                  "Poor service",
                  "Overpricing",
                  "Scam/Fraud",
                  "Violation of terms",
                  "Other",
              ]
            : [
                  "Inappropriate behavior",
                  "Fake reviews",
                  "Harassment",
                  "Spam",
                  "Violation of terms",
                  "Other",
              ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason || !description.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newReport = {
                id: Date.now().toString(),
                reporterId: "current-user-id",
                reporterName,
                reporterType,
                targetId,
                targetType,
                targetName,
                reason,
                description,
                createdAt: new Date().toISOString(),
                status: "pending" as const,
            };

            console.log("Report submitted:", newReport);

            toast({
                title: "Report Submitted",
                description: `Your report against ${targetName} has been submitted successfully.`,
            });

            setReason("");
            setDescription("");
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" />
                        Report {targetType === "shop" ? "Shop" : "User"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">
                            Reporting:{" "}
                            <span className="font-semibold">{targetName}</span>
                        </Label>
                    </div>

                    <div>
                        <Label htmlFor="reason" className="mb-2">
                            Reason for Report *
                        </Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="focus:ring-2 focus:ring-gray-300 border-gray-200">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-md">
                                {reportReasons.map((reportReason) => (
                                    <SelectItem
                                        key={reportReason}
                                        value={reportReason}
                                        className="hover:bg-gray-100 focus:bg-gray-100"
                                    >
                                        {reportReason}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="description" className="mb-2">
                            Additional Details *
                        </Label>
                        <Textarea
                            className="bg-white border border-gray-200 shadow-md focus:ring-2 focus:ring-gray-300"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide more details about the issue..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isSubmitting}
                            className="flex-1 bg-red-500"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-gray-200"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
