import { useEffect, useState } from "react";

interface CounterOptions {
  start?: number;
  duration?: number;
  delay?: number;
}

export function useCounter(
  end: number,
  isVisible: boolean,
  options: CounterOptions = {}
) {
  const { start = 0, duration = 2000, delay = 0 } = options;
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(
          easeOutQuart * (end - start) + start
        );

        setCount(currentCount);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, end, start, duration, delay]);

  return count;
}
