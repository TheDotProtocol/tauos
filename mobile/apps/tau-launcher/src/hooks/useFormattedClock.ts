import { useEffect, useState } from 'react';

/** Local device clock for home screen — no network */
export function useFormattedClock(): { time: string; date: string } {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return { time, date };
}
