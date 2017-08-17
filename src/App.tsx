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
          numDays={max - min}
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
            const scaled = (Math.round(record.count / maxCount) * 6) + 1;
            return `color-scale-${scaled}`;
          }}
        />; 
}

class AppState {
  datesText: string;
}

class App extends React.Component<{}, AppState> {

  constructor() {
    super();

    this.state = {
      datesText: `2011-11-04
2012-06-02
2012-06-02
2012-06-02
2013-01-18
2013-01-18`
    };
  }

  setDatesText(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      datesText: ev.target.value
    });    
  }

  render() {

    var dates = this.state.datesText
                  .split('\n')
                  .map(line => new Date(line));

    return (
      <div className="App">

        <Heatmap dates={dates} />

        <textarea value={this.state.datesText}
          onChange={ev => this.setDatesText(ev)} />
          
      </div>
    );
  }
}

export default App;
