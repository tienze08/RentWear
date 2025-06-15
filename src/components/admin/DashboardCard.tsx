
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: DashboardCardProps) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && (
          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {typeof trend !== 'undefined' && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            trend >= 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
          )}>
            {trend >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
