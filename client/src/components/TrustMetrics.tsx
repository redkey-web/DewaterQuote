import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Award, Users, Package } from "lucide-react";

interface Metric {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  {
    icon: <Package className="w-8 h-8" />,
    value: 500,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 25,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 100,
    suffix: "%",
    label: "Quality Guaranteed",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8" />,
    value: 1000,
    suffix: "+",
    label: "Happy Customers",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);

            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={counterRef} className="text-4xl md:text-5xl font-bold text-primary">
      {count}
      {suffix}
    </div>
  );
}

export default function TrustMetrics() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center"
              data-testid={`metric-${index}`}
            >
              <div className="flex justify-center mb-4 text-primary">
                {metric.icon}
              </div>
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              <div className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
