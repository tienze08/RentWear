import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import ApiConstants from "../../lib/api";

interface AutoReturnResult {
  success: boolean;
  processedCount?: number;
  error?: unknown;
}

const RentalManagement = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutoReturnResult | null>(null);

  const triggerAutoReturn = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await axiosInstance.post(ApiConstants.TRIGGER_AUTO_RETURN);
      setResult(response.data.result);
    } catch (error) {
      console.error("Failed to trigger auto return:", error);
      setResult({
        success: false,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rental Management</h1>
        <p className="text-gray-600">Manage rental lifecycle and automation</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Auto Return System</h2>
        <p className="text-gray-600 mb-4">
          Automatically process expired rentals and return products to available status.
          This runs automatically every hour, but you can trigger it manually here.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={triggerAutoReturn}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Trigger Auto Return
              </>
            )}
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                {result.success 
                  ? `Successfully processed ${result.processedCount || 0} expired rentals`
                  : "Failed to process auto return. Check console for details."
                }
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Rental Automation Rules</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <span>Rentals are automatically marked as RETURNED when they pass the end date</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <span>Products are automatically marked as available when rental ends</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <span>Customers cannot cancel rentals after 24 hours from start date</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <span>Auto-return process runs every hour</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RentalManagement;
