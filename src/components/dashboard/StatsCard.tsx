import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description 
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">from last period</span>
            </div>
          )}
          
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );
}