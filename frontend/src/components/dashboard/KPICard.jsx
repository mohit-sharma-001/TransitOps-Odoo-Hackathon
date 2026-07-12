import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const stringVal = String(value);
    const numericMatch = stringVal.match(/^([\d.]+)(%?)$/);
    
    if (!numericMatch) {
      setDisplayValue(stringVal);
      return;
    }

    const targetNum = parseFloat(numericMatch[1]);
    const suffix = numericMatch[2] || "";
    const isDecimal = stringVal.includes(".");

    let start = 0;
    const duration = 1200; // 1.2s animation
    const startTime = performance.now();

    function updateNumber(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out quartic for premium deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = easeProgress * targetNum;
      
      if (isDecimal) {
        setDisplayValue(currentVal.toFixed(1) + suffix);
      } else {
        setDisplayValue(Math.floor(currentVal) + suffix);
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function KPICard({
  title,
  value,
  description,
  trend,
  trendType, // "up" | "down" | "neutral"
  icon: Icon,
  colorClass = "border-blue-500", // accent color
  iconBgClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 shadow-xs flex flex-col gap-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
      className={`p-5 rounded-2xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/40 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between border-l-4 ${colorClass}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl flex-shrink-0 ${iconBgClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          <AnimatedNumber value={value} />
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2">
          {trend && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendType === "up" 
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450" 
                : trendType === "down" 
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450"
                : "bg-slate-50 text-slate-600 dark:bg-slate-850 dark:text-slate-400"
            }`}>
              {trend}
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-450 truncate">
            {description}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
