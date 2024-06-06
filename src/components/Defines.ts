export type DataCSV = {
    Date: string
    Volume: string
    Open: string
    Close: string
    High: string
    Low: string
}
  
export type ValuesCSV = {
    data: DataCSV[]
}

export type State = {
    dataFromFileCSV : DataCSV[],
}

export interface Trace {
    x:string[], 
    close: number[], 
    high: number[],
    low: number[], 
    open: number[],
    decreasing: {},
    increasing: {},
    line: {},
    type: string,
    xaxis: string,
    yaxis: string
}

export var traceData : Trace = {
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