import { CheckCircle, Award, Clock, Users } from "lucide-react"
import GeoStock from "./GeoStock"

export default function USPBar() {
  return (
    <div className="py-6 px-6 bg-muted/50 border-y border-border mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <GeoStock />
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Certified Quality</p>
              <p className="text-xs text-muted-foreground">AS/NZS, WRAS, ISO</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Fast Delivery</p>
              <p className="text-xs text-muted-foreground">Australia-wide</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Expert Support</p>
              <p className="text-xs text-muted-foreground">(08) 9271 2577</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
