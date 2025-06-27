import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Complaint {
    id: number;
    reporter: string;
    reason: string;
    description: string;
    date: string;
    severity: "Low" | "Medium" | "High";
}

interface BanConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    title: string;
    description: string;
    entityName: string;
    complaints?: Complaint[];
}

const BanConfirmationDialog = ({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    entityName,
    complaints = [],
}: BanConfirmationDialogProps) => {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason.trim());
            setReason("");
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        setReason("");
        onOpenChange(false);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-2xl max-h-[80vh] bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description.replace("{entityName}", entityName)}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {complaints.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Complaints/Reports ({complaints.length})
                        </Label>
                        <ScrollArea className="h-40 w-full rounded-md border p-3">
                            <div className="space-y-3">
                                {complaints.map((complaint) => (
                                    <Card key={complaint.id} className="p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    Reported by:{" "}
                                                    {complaint.reporter}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={getSeverityColor(
                                                        complaint.severity
                                                    )}
                                                >
                                                    {complaint.severity}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {complaint.date}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-700">
                                                Reason: {complaint.reason}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {complaint.description}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="ban-reason">
                        Admin decision reason (required)
                    </Label>
                    <Textarea
                        id="ban-reason"
                        placeholder="Please provide a detailed reason for your decision to ban this entity..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        Don't Ban
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Confirm Ban
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BanConfirmationDialog;
