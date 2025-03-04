import React, { useState,useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './css/Menu.css'
import axios from 'axios';
import CircularJSON from 'circular-json';



// AG-Grid에서 필요한 모듈을 import
import { AllCommunityModule } from 'ag-grid-community';

const News = () => {

  const [rowData, setRowData] = useState([
    {
      "name": "test1",
      "day_1": "D",
      "day_2": "D",
      "day_3": "D",
      "day_4": "D",
      "day_5": "D",
      "day_6": "D",
      "day_7": "D",
      "day_8": "D",
      "day_9": "D",
      "day_10": "D",
      "day_11": "D",
      "day_12": "D",
      "day_13": "D",
      "day_14": "D",
      "day_15": "D",
      "day_16": "D",
      "day_17": "D",
      "day_18": "D",
      "day_19": "D",
      "day_20": "D",
      "day_21": "D",
      "day_22": "D",
      "day_23": "D",
      "day_24": "D",
      "day_25": "D",
      "day_26": "D",
      "day_27": "D",
      "day_28": "D",
      "day_29": "D",
      "day_30": "D",
      "day_31": 1
    },
    {
      "name": "test2",
      "day_1": "D",
      "day_2": "D",
      "day_3": "D",
      "day_4": "D",
      "day_5": "D",
      "day_6": "D",
      "day_7": "D",
      "day_8": "D",
      "day_9": "D",
      "day_10": "D",
      "day_11": "D",
      "day_12": "D",
      "day_13": "D",
      "day_14": "D",
      "day_15": "D",
      "day_16": "D",
      "day_17": "D",
      "day_18": "D",
      "day_19": "D",
      "day_20": "D",
      "day_21": "D",
      "day_22": "D",
      "day_23": "D",
      "day_24": "D",
      "day_25": "D",
      "day_26": "D",
      "day_27": "D",
      "day_28": "D",
      "day_29": "D",
      "day_30": "D",
      "day_31": "D"
    },
    {
      "name": "test3",
      "day_1": "D",
      "day_2": "D",
      "day_3": "D",
      "day_4": "D",
      "day_5": "D",
      "day_6": "D",
      "day_7": "D",
      "day_8": "D",
      "day_9": "D",
      "day_10": "D",
      "day_11": "D",
      "day_12": "D",
      "day_13": "D",
      "day_14": "D",
      "day_15": "D",
      "day_16": "D",
      "day_17": "D",
      "day_18": "D",
      "day_19": "D",
      "day_20": "D",
      "day_21": "D",
      "day_22": "D",
      "day_23": "D",
      "day_24": "D",
      "day_25": "D",
      "day_26": "D",
      "day_27": "D",
      "day_28": "D",
      "day_29": "D",
      "day_30": "D",
      "day_31": "D"
    },
    {
      "name": "test4",
      "day_1": "D",
      "day_2": "D",
      "day_3": "D",
      "day_4": "D",
      "day_5": "D",
      "day_6": "D",
      "day_7": "D",
      "day_8": "D",
      "day_9": "D",
      "day_10": "D",
      "day_11": "D",
      "day_12": "D",
      "day_13": "D",
      "day_14": "D",
      "day_15": "D",
      "day_16": "D",
      "day_17": "D",
      "day_18": "D",
      "day_19": "D",
      "day_20": "D",
      "day_21": "D",
      "day_22": "D",
      "day_23": "D",
      "day_24": "D",
      "day_25": "D",
      "day_26": "D",
      "day_27": "D",
      "day_28": "D",
      "day_29": "D",
      "day_30": "D",
      "day_31": "D"
    }
  ]
  );
  const [columnDefs, setColumnDefs] = useState([
        { headerName: "Name", field: "name" ,width:70}
    ]);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setcolumnApi] = useState(null);
  const gridRef = useRef();

  const generateDateHeaders = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate(); // 이번 달의 마지막 날 계산

    const dateHeaders = [];
    for (let day = 1; day <= lastDay; day++) {
        dateHeaders.push({ headerName: day.toString(), field: `day_${day}`,editable: false,width:45 });
    }
    return dateHeaders;
};

// useEffect(() => {
//   // 스프링 서버에서 데이터를 가져와 첫 번째 컬럼 설정
//   axios.get('/api/names')
//       .then(response => {
//           const names = response.data;
//           const initialRowData = names.map(name => ({ name: name }));
//           setRowData(initialRowData);

//           // 날짜 헤더 추가
//           const dateHeaders = generateDateHeaders();
//           setColumnDefs(prevDefs => [...prevDefs, ...dateHeaders]);
//       })
//       .catch(error => console.error('Error fetching names:', error));
// }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setcolumnApi(params.columnApi);
    gridRef.current.api.sizeColumnsToFit();
    

    const dateHeaders = generateDateHeaders();
    setColumnDefs(prevDefs => [...prevDefs, ...dateHeaders]);

  };


  const onCellKeyDown = (event) => {
    const selectedCell = gridApi.getFocusedCell(); 
    const rowNode = gridApi.getDisplayedRowAtIndex(selectedCell.rowIndex);

    if(event.event.code =='KeyD'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'D');
      gridApi.getCellStyle(selectedCell.rowIndex, selectedCell.column.getColId(), { color: 'red' });
    }
    else if(event.event.code =='KeyE'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'E');
    }
    else if(event.event.code =='KeyO'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'O');
    }
    else if(event.event.code =='KeyN'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'N');
    }
  };
  
    return (
      <div style={{ width: '100%', height: '600px' }} className="ag-theme-alpine">
      <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
          modules={[AllCommunityModule]}
          onCellKeyDown={onCellKeyDown} // 키 이벤트 처리
      />
  </div>
    );
  };
  
  export default News;
  