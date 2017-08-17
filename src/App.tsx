import * as React from 'react';
import './App.css';
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
            const scaled = Math.round(6 * record.count / maxCount) + 1;
            return `color-scale-${scaled}`;
          }}
        />; 
}

class AppState {
  datesText: string;
  dates: Date[];
  error: string;
}

const exampleDates = `2011-11-04
2012-06-02
2012-06-02
2012-06-02
2013-01-18
2013-01-18`

class App extends React.Component<{}, AppState> {

  constructor() {
    super();

    this.state = {
      datesText: exampleDates,
      dates: [],
      error: ""
    };

    Object.assign(this.state, this.parseDatesText(exampleDates));
  }

  parseDatesText(datesText: string) {

    const dates: Date[] = [],
          errors: string[] = [];
    
    let lineNumber = 1;
    for (const text of datesText.trim().split('\n')) {
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        dates.push(date);
      } else {
        errors.push(`Invalid date on line ${lineNumber}: ${text}`);
      }
      lineNumber++;
    }
        
    return { dates, error: errors.join("\n") };
  }

  setDatesText(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    const datesText = ev.target.value || "";
    this.setState({ datesText })
    this.setState(this.parseDatesText(datesText));
  }

  render() {
    return (
      <div className="App">
        <div className="result">
          <div className="border scrollable">
            <Heatmap dates={this.state.dates} />
            <pre className="error">{this.state.error}</pre>
          </div>
        </div>
        <div className="dates">
          <div className="border nonscrollable">
            <textarea value={this.state.datesText} onChange={ev => this.setDatesText(ev)} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
