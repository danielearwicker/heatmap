import * as React from 'react';
import CalendarHeatmap, { Record } from 'react-calendar-heatmap';

interface HeatmapProps {
  dates: Date[];
}

const msPerDay = 24*60*60*1000;

function Heatmap({ dates }: HeatmapProps) {
  const counts: { [ms: number]: number } = [];
  let min = Number.MAX_SAFE_INTEGER, max = 0;
  let maxCount = 0;
  for (const date of dates) {
    const ms = Math.floor(date.getTime() / msPerDay);
    const count = counts[ms] = (counts[ms] || 0) + 1;
    min = Math.min(min, ms);
    max = Math.max(max, ms);
    maxCount = Math.max(maxCount, count);
  }

  const minCount = Object.keys(counts).map(d => counts[d]).reduce((a, b) => Math.min(a, b));
  const countRange = maxCount - minCount;

  return <CalendarHeatmap
          endDate={new Date(max * msPerDay)}
          numDays={1 + max - min}
          values={
            Object.keys(counts).map(ms => ({
              date: new Date(parseInt(ms, 10) * msPerDay),
              count: counts[ms]
            }))
          }
          classForValue={(record: Record) => {
            if (!record) {
              return 'color-empty';
            }
            const scaled = Math.round(6 * (record.count - minCount) / countRange) + 1;
            return `color-scale-${scaled}`;
          }}
        />; 
}

export default Heatmap;
