import React, { useState,useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './css/Menu.css'
import axios from 'axios';



// AG-Grid에서 필요한 모듈을 import
import { AllCommunityModule } from 'ag-grid-community';

const News = () => {

  const [rowData, setRowData] = useState([{
    name: 'asd',
    PARENT_ID: 'user123',
    STATUS: null,
    NURSE_ID: 'NUR001',
    NURSE_NM: '홍길동',
    USE_YN: true
},
{
    DELETE: false,
    PARENT_ID: 'user456',
    STATUS: null,
    NURSE_ID: 'NUR002',
    NURSE_NM: '김철수',
    USE_YN: true
},
{
    DELETE: false,
    PARENT_ID: 'user789',
    STATUS: null,
    NURSE_ID: 'NUR003',
    NURSE_NM: '이영희',
    USE_YN: false
}]);
  const [columnDefs, setColumnDefs] = useState([
        { headerName: "Name", field: "name" ,width:70}
    ]);
const gridApi = useRef(null);
    const columnApi = useRef(null);
  const gridRef = useRef();

  const generateDateHeaders = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate(); // 이번 달의 마지막 날 계산

    const dateHeaders = [];
    for (let day = 1; day <= lastDay; day++) {
        dateHeaders.push({ headerName: day.toString(), field: `day_${day}`,editable: true,width:45 });
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
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
     gridApi.current.sizeColumnsToFit();


    const dateHeaders = generateDateHeaders();
    setColumnDefs(prevDefs => [...prevDefs, ...dateHeaders]);

  };


  
    return (
      <div style={{ width: '100%', height: '600px' }} className="ag-theme-alpine">
      <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
          modules={[AllCommunityModule]}
          
      />
  </div>
    );
  };
  
  export default News;
  