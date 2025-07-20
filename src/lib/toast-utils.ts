import { toast } from "@/hooks/use-toast";

// Beautiful toast utilities with predefined styles
export const showSuccessToast = (title: string, description: string) => {
    toast({
        title: `✅ ${title}`,
        description,
        className: "border-green-300 bg-gradient-to-r from-green-50 to-emerald-100 text-green-900 shadow-lg shadow-green-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm",
    });
};

export const showErrorToast = (title: string, description: string) => {
    toast({
        title: `❌ ${title}`,
        description,
        variant: "destructive",
        className: "border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-900 shadow-lg shadow-red-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm",
    });
};

export const showWarningToast = (title: string, description: string) => {
    toast({
        title: `⚠️ ${title}`,
        description,
        className: "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-900 shadow-lg shadow-amber-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm",
    });
};

export const showInfoToast = (title: string, description: string) => {
    toast({
        title: `ℹ️ ${title}`,
        description,
        className: "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-900 shadow-lg shadow-blue-100/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm",
    });
};

// Rental-specific toast messages
export const rentalToasts = {
    cancelSuccess: () => showSuccessToast("Success!", "Your rental has been cancelled successfully."),
    cancelError: () => showErrorToast("Error!", "Failed to cancel rental. Please try again."),
    createSuccess: () => showSuccessToast("Success!", "Your rental request has been submitted!"),
    createError: () => showErrorToast("Error!", "Failed to create rental. Please try again."),
    paymentSuccess: () => showSuccessToast("Payment Successful!", "Your payment has been processed successfully."),
    paymentError: () => showErrorToast("Payment Failed!", "There was an issue processing your payment."),
};
