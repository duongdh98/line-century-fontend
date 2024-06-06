import React, { useEffect } from 'react';
import './../css/Dashboard.css'
import { DataCSV, ValuesCSV, State, Trace, traceData } from './Defines';
import { Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import Papa, { ParseResult } from "papaparse";
import Plot from "react-plotly.js";

import dayjs from 'dayjs';
// Define
let isLoaddingDone = false;
let minDate : string;
let maxDate : string;
let fromDateValue : string;
let toDateValue : string;

var dataOHLC = traceData;
var layout = {
  dragmode: 'zoom',
  margin: {
    r: 10, 
    t: 25, 
    b: 40, 
    l: 60
  },
  showlegend: false,  
  xaxis: {
    autorange: true, 
    //title: 'Date', 
    type: 'category',
    rangeslider: {
      visible: false
    },
    //range: ['2023-08-15', '2024-01-02'],
    gridcolor: 'rgba(255, 255, 255, 0.2)',
    tickfont: {
      color: 'white'
    },
    tickmode: 'auto',
    nticks: 6,
    rangeselector: {
      x: 0,
      y: 1.2,
      xanchor: 'left',
      buttons: [{
          step: 'month',
          stepmode: 'backward',
          count: 1,
          label: '1 month'
      }, {
          step: 'month',
          stepmode: 'backward',
          count: 6,
          label: '6 months'
      }, {
          step: 'all',
          label: 'All dates'
      }]
    }
  }, 
  yaxis: {
    autorange: true,
    type: 'linear', 
    side: 'right',
    gridcolor: 'rgba(255, 255, 255, 0.2)',
    tickfont: {
      color: 'white'
    }
  },
  plot_bgcolor: 'rgba(0, 0, 0, 0.8)',
  paper_bgcolor: 'rgba(0, 0, 0, 0.8)',
};

function parseDataChart(fromDate : any, toDate : any) {
  var trace : Trace = {
    type: 'ohlc', 
    xaxis: 'x', 
    yaxis: 'y',
    x: [], 
    close: [],   
    decreasing: {line: {color: '#7F7F7F'}}, 
    high: [], 
    increasing: {line: {color: '#17BECF'}}, 
    line: {color: 'rgba(31,119,180,1)'}, 
    low: [], 
    open: [], 
  };
  if (dayjs(fromDate).isAfter(dayjs(toDate))) {
    alert("From date is After of to date ! please try agian");
    return;
  }
  if(dayjs(fromDate).isBefore(dayjs(minDate))) {
    alert("Start day out of range");
    return;
  };
  if(dayjs(toDate).isAfter(dayjs(maxDate))) {
    alert("End day out of range");
    return;
  }

  console.log("From : ", fromDate, "To : ", toDate);
  traceData.x.push(maxDate);
  let indexFromDate = traceData.x.indexOf(fromDate);
  let indexToDate = traceData.x.indexOf(toDate);
  console.log("Position : ", indexFromDate, indexToDate, traceData);

  trace.x = traceData.x.slice(indexFromDate, indexToDate);
  trace.open = traceData.open.slice(indexFromDate, indexToDate);
  trace.close = traceData.close.slice(indexFromDate, indexToDate);
  trace.high = traceData.high.slice(indexFromDate, indexToDate);
  trace.low = traceData.low.slice(indexFromDate, indexToDate);
  
  return trace as Trace;
}
function Dashboard() {

  let [isDateChange, setDateChange] = React.useState<number>(0);
  const [valuesFromFileCSV, setValuesFromFileCSV] = React.useState<ValuesCSV | undefined>();
  const getCSV = async () => {
    await Papa.parse("/VFS_historical_data_StockScan.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (results: ParseResult<DataCSV>) => {
        setValuesFromFileCSV(results)
      },
    })
    return valuesFromFileCSV;
  }
  
  if (valuesFromFileCSV && isLoaddingDone == false) {
    const data = valuesFromFileCSV.data; 
    for (let val of data.reverse()) { 
      traceData.x.push(val.Date);
      traceData.close.push(parseFloat(val.Close));
      traceData.high.push(parseFloat(val.High));
      traceData.low.push(parseFloat(val.Low));
      traceData.open.push(parseFloat(val.Open)); 
    }
    minDate = traceData.x[0];
    maxDate = traceData.x.pop() as string;
    fromDateValue = minDate;
    toDateValue = maxDate;
    isLoaddingDone = true;
  }

  useEffect(() => {
    getCSV();
  }, [])

  // --- Handle data from dom
  let fromDateChange = (fromDate : any) : void => {
    fromDateValue = fromDate.format('YYYY-MM-DD');
    const data = parseDataChart(fromDateValue, toDateValue);
    dataOHLC = data as Trace;
    setDateChange(isDateChange + 1);
  }
  let toDateChange = (toDate : any) : void => {
    toDateValue = toDate.format('YYYY-MM-DD');
    const data = parseDataChart(fromDateValue, toDateValue);
    dataOHLC = data as Trace;
    setDateChange(isDateChange + 1);
  }

  return (
  <div className='screen'> 
      <div className="head">  
      </div>
      <div className="main">
          <div className="main__chart"> 
              <div className="main__chart__head"> 
                  <div id="from-date">
                    {valuesFromFileCSV !== undefined && (
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}>
                        <DatePicker
                        value={dayjs(fromDateValue)}
                          onChange={fromDateChange}
                          label='From Date' 
                          sx={{
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { border: '1px solid white' },  // at page load
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '2px solid white' },  // at hover state
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '3px solid white' }, // at focused state
                            }}
                          />
                      </LocalizationProvider>
                    )}
                  </div>
                  <div id="end-date">
                    {valuesFromFileCSV !== undefined && (
                      <LocalizationProvider
                      dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        value={dayjs(toDateValue)}
                        onChange={toDateChange}
                        sx={{
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { border: '1px solid white' },  // at page load
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: '2px solid white' },  // at hover state
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '3px solid white' }, // at focused state
                        }}
                        label='To Date'
                      />
                    </LocalizationProvider>
                    )}
                  </div>
              </div>
              <div className="main__chart__main">
                {dataOHLC && (
                  <Plot
                    data={[dataOHLC as {}]}
                    layout={layout as {}}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>
          </div>
      </div>
      <div className="footer"></div> 
  </div>
  );
}

export default Dashboard;
