import { Truck } from "lucide-react";

export default function AnnouncementBanner() {
  return (
    <div className="bg-sky-200 dark:bg-sky-800 text-foreground py-2 overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
        <span className="inline-flex items-center gap-2 px-8">
          <Truck className="w-4 h-4" />
          Free Delivery to Metro Areas
        </span>
      </div>
    </div>
  );
}
