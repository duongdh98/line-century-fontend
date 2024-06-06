import React from 'react';
import { DataCSV, ValuesCSV } from './Defines';

import Papa, { ParseResult } from "papaparse"

const useReadCSV = () => {
    
    const [values, setValues] = React.useState<ValuesCSV | undefined>();

    const getCSV = async () => {
        await Papa.parse("/VFS_historical_data_StockScan.csv", {
          header: true,
          download: true,
          skipEmptyLines: true,
          delimiter: ",",
          complete: (results: ParseResult<DataCSV>) => {
            setValues(results)
          },
        })
    }
    React.useEffect(() => {
        getCSV()
    }, [])

    return values;
}

export default useReadCSV;