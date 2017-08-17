import * as React from 'react';
import './App.css';
import Heatmap from './Heatmap';

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

    const dates: Date[] = [], errors: string[] = [];

    let lineNumber = 1;
    for (const text of datesText.trim().split('\n').map(t => t.trim())) {
      if (text) {
        const date = new Date(text);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        } else {
          errors.push(`Invalid date on line ${lineNumber}: ${text}`);
        }
      }
      lineNumber++;
    }

    return { dates, error: errors.join("\n") };
  }

  timer: any;

  setDatesText(ev: React.ChangeEvent<HTMLTextAreaElement>) {

    this.setState({ datesText: ev.target.value || "" });
    
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.setState(this.parseDatesText(this.state.datesText));
    }, 500);
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
