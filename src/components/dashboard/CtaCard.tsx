import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CtaCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
}

export default function CtaCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  buttonText 
}: CtaCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
      <div className="p-3 bg-indigo-50 rounded-lg w-fit mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 flex-1">{description}</p>
      
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}