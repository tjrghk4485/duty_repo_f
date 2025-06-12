import React, { useCallback,useState,useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './css/Menu.css'
import axios from 'axios';
import CircularJSON from 'circular-json';
import OptimizeDialog from './OptimizeDialog.jsx';


// AG-Grid에서 필요한 모듈을 import
import { ModuleRegistry } from 'ag-grid-community'; 
import { AllCommunityModule,CsvExportModule } from 'ag-grid-community';


const NurseSchedule = () => {
  const gridApi = useRef([]);
  const columnApi = useRef([]);
  const [rowData, setRowData] = useState([]);
  const [underRowData, setUnderRowData] = useState([]);
  const [sideRowData, setSideRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
        { headerName: "name", field: "name" ,width:80,headerClass: ['ag-center-header','df-header'],
          cellStyle: {
          borderRight: "1px solid #ccc"
        }},
        { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}
    ]);
    const [underColumnDefs, setUnderColumnDefs] = useState([
      { headerName: "type", field: "type" ,width:80,headerClass: ['ag-center-header','df-header'],
        cellStyle: {
        borderRight: "1px solid #ccc"
      }},
      { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}
    ]);
    const [sideColumnDefs, setSideColumnDefs] = useState([
      { headerName: "type", field: "type" ,width:80,hide: true ,headerClass: ['ag-center-header','df-header'],
        cellStyle: {
        borderRight: "1px solid #ccc"
      }},
      { headerName: "nurse_id", field: "nurse_id" ,width:90,hide: true}
  ]);
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1); // 실제 달 (1~12)
    const [year, setYear] = useState(now.getFullYear());
    const [lastDay, setLastDay] = useState(0);
    const [yyyymm, setYyyymm] = useState('');
    const [open, setOpen] = useState(false);
    // month나 year가 바뀔 때마다 lastDay, yyyymm 다시 계산
    useEffect(() => {
      
      const newLastDay = new Date(year, month, 0).getDate();
      const monthStr = String(month).padStart(2, '0');
      const newYyyymm = `${year}${monthStr}`;
  
      setLastDay(newLastDay);
      setYyyymm(newYyyymm);
      console.log('yyyymm1' + yyyymm);
  
    }, [month]);

    useEffect(() => {
      // 여기에 날짜 헤더 생성 및 columnDefs 업데이트 추가!
  const dateHeaders = generateDateHeaders(); // ← 이 시점엔 month가 업데이트되어 있음
  const beforeDateHeaders = sideDateHeaders();
  setColumnDefs(prevDefs => {
    const baseCols = prevDefs.filter(col => !col.isDynamic);
    return [...baseCols, ...dateHeaders];})
    
    setUnderColumnDefs(prevDefs => {
      const baseCols = prevDefs.filter(col => !col.isDynamic);
      return [...baseCols, ...dateHeaders];})  

      setSideColumnDefs(prevDefs => {
        const baseCols = prevDefs.filter(col => !col.isDynamic);
        return [...baseCols, ...beforeDateHeaders];})  

    }, [lastDay]
  
  );

    useEffect(() => {
      if (columnDefs.length > 0) {
        setTimeout(() => {
          selectRow();
          sideSelectRow();
        }, 0);
      }
    }, [columnDefs]);

    useEffect(() => {
      if (rowData.length > 0) {
        // rowData가 업데이트된 후 selectUnderGrid 호출
        selectUnderGrid();
      }
    }, [rowData]);
  const gridRef = useRef([]);



//   const generateDateHeaders = () => {

//     const dateHeaders = [];
//     for (let day = 1; day <= lastDay; day++) {
//         dateHeaders.push({ headerName: day.toString(), field: `${day}`,editable: false ,width:45 ,headerClass: 'ag-center-header',isDynamic: true ,cellStyle: (params) => {
//           if (params.value === 'D') { return { color:'rgb(91, 177, 73)',border: '1px solid #ccc',padding: '4px' }; } 
//           else if (params.value === 'E') { return {color:'rgb(132, 161, 204)',border: '1px solid #ccc',padding: '4px'  }; }
//           else if (params.value === 'N') { return {color:'rgb(149, 64, 199)',border: '1px solid #ccc',padding: '4px'  }; }
//           else if (params.value === 'O') { return { color:'rgb(138, 136, 134)',border: '1px solid #ccc',padding: '4px'  }; }
//           return null;}});
//     }
//     return dateHeaders;
// };
  const generateDateHeaders = () => {
    const dateHeaders = [];

    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month - 1, day); // JS는 month가 0부터 시작
      const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const headerClass = isWeekend ? 'weekend-header' : 'df-header';

      dateHeaders.push({
        headerName: day.toString(),
        field: `${day}`,
        editable: false,
        width: 45,
        headerClass, // 요일 기준 동적 설정
        isDynamic: true,
        suppressMovable: true,       // 헤더 위치 이동 막기
        cellStyle: (params) => {
          if (params.value === 'D') {
            return { color: 'rgb(91, 177, 73)' ,borderRight: "1px solid #ccc"};
          } else if (params.value === 'E') {
            return { color: 'rgb(132, 161, 204)',borderRight: "1px solid #ccc" };
          } else if (params.value === 'N') {
            return { color: 'rgb(149, 64, 199)',borderRight: "1px solid #ccc" };
          } else if (params.value === 'O') {
            return { color: 'rgb(138, 136, 134)',borderRight: "1px solid #ccc" };
          } else {borderRight: "1px solid #ccc"};
          return null;
        }
      });
    }

    return dateHeaders;
  };


  const sideDateHeaders = () => {
    const dateHeaders = [];
    const beforeDay = new Date(year, month-1, 0).getDate();
    console.log('beforeDay=' + beforeDay);
    for (let day = (beforeDay-3); day <= beforeDay; day++) {
      const date = new Date(year, month - 1, day); // JS는 month가 0부터 시작
      const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const headerClass = isWeekend ? 'weekend-header' : 'df-header';

      dateHeaders.push({
        headerName: day.toString(),
        field: `${day}`,
        editable: false,
        width: 45,
        headerClass, // 요일 기준 동적 설정
        isDynamic: true,
        cellStyle: (params) => {
          if (params.value === 'D') {
            return { color: 'rgb(91, 177, 73)' ,borderRight: "1px solid #ccc"};
          } else if (params.value === 'E') {
            return { color: 'rgb(132, 161, 204)',borderRight: "1px solid #ccc" };
          } else if (params.value === 'N') {
            return { color: 'rgb(149, 64, 199)',borderRight: "1px solid #ccc" };
          } else if (params.value === 'O') {
            return { color: 'rgb(138, 136, 134)',borderRight: "1px solid #ccc" };
          } else {borderRight: "1px solid #ccc"};
          return null;
        }
      });
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

  const onGridReady = (params, gridIndex) => {
    gridApi.current[gridIndex] = params.api;
    columnApi.current[gridIndex] = params.columnApi;
    gridRef.current[gridIndex].api.sizeColumnsToFit();
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = now.toLocaleDateString();
    // const yyyymm = `${year}${month}`;
    // console.log('now='+now);
    // console.log('year='+year);
    // console.log('month='+month);
    // console.log('yyyymm='+yyyymm);
    // const dateHeaders = generateDateHeaders();
    // setColumnDefs(prevDefs => [...prevDefs, ...dateHeaders]);

    selectRow();
    sideSelectRow();
    
    console.log(`그리드 ${gridIndex} 준비 완료`, params.api);
  };

  const selectRow = () => {
    axios.get('http://localhost:3001/schedule/sel',{
        params: {
          parent_id: localStorage.getItem('userId'),
          work_date: yyyymm
        }
    })
    .then(response => {
        setRowData(response.data);
        //console.log("response.data" + response.data);
    })
  .catch(error => alert('Error:', error));
  };

  const sideSelectRow = () => {
    axios.get('http://localhost:3001/schedule/side/sel',{
        params: {
          parent_id: localStorage.getItem('userId'),
          work_date: yyyymm-1
        }
    })
    .then(response => {
        setSideRowData(response.data);
        //console.log("response.data" + response.data);
    })
  .catch(error => alert('Error:', error));
    console.log("gridApi.current[1]=" + gridApi.current[1]);
  //const allData = gridApi.current[1].getRenderedNodes().map(node => node.data);

  };

  const createDuty = async () => {
    
    if(!confirm(month + '월 일정표를 생성하시겠습니까?')) {
      return;
    }

    try {
      const response =  await axios.post('http://localhost:3001/schedule/create', {
        
          parent_id: localStorage.getItem('userId'),
          work_date: yyyymm
        
    });
      console.log('서버 응답:', response.data.output_msg);
      alert('서버 응답:' + response.data.output_msg);
      if(response.data.output_msg == '저장되었습니다'){
        selectRow();
        sideSelectRow();
    }
    } catch (error) {
      console.error('서버에 데이터 전송 중 오류:', error);
      alert('서버 에러응답:' + response.data.output_msg);
    }
  }


  const deletAllData = async () => {
    
    if(!confirm('일정을 초기화 하시겠습니까?')) {
      return;
    }

    try {
      const response =  await axios.post('http://localhost:3001/schedule/delete', {
        
          parent_id: localStorage.getItem('userId'),
          work_date: yyyymm
        
    });
      console.log('서버 응답:', response.data.output_msg);
      alert('서버 응답:' + response.data.output_msg);
      if(response.data.output_msg == '저장되었습니다'){
        selectRow();
        sideSelectRow();
    }
    } catch (error) {
      console.error('서버에 데이터 전송 중 오류:', error);
      alert('서버 에러응답:' + response.data.output_msg);
    }
  }


  const sendDataToServer = async () => {
    // gridApi가 초기화되었을 때만 호출
    if (gridApi.current[1]) {
        // const selectedData = gridApi.current[1].getSelectedRows();  // 선택된 데이터 가져오기
        // console.log("selectedData =", selectedData);
        const allData = [];
        gridApi.current[1].forEachNode((node) => {
            allData.push(node.data); // 각 행의 데이터를 배열에 추가
        });
        
        console.log("전체 데이터:", allData);

        const formattedData = allData.flatMap(item => {
          const parent_id = item.parent_id; // parent_id를 work_date로 사용
          const nurse_id = item.nurse_id; // name을 nurse_id로 사용
        
          return Object.keys(item)
            .filter(key => !isNaN(key)) // 숫자 키(1~31)만 필터링
            .map(key => ({
              work_date: yyyymm,
              parent_id: parent_id,
              nurse_id: nurse_id,
              work_type: item[key], // 해당 날짜의 work_type
              work_day: parseInt(key, 10), // 1~31을 work_day로 사용
            }));
        });

        console.log("수정 후 전체 데이터:",formattedData);

        try {
            const response = await axios.post('http://localhost:3001/schedule/mod', formattedData);
            console.log('서버 응답:', response.data.output_msg);
            alert('서버 응답:' + response.data.output_msg);
            selectRow();
            sideSelectRow();
        } catch (error) {
            console.error('서버에 데이터 전송 중 오류:', error);
            alert('서버 에러응답:' + response.data.output_msg);
        }
    } else {
        console.log("gridApi가 초기화되지 않았습니다.");
    }
  };



  const autoSchedule = async () => {
    
    if(!confirm('듀티표 자동생성 할거임?')) {
      return;
    }

    try {
      const response =  await axios.post('http://localhost:3001/schedule/auto', {
        
          parent_id: localStorage.getItem('userId'),
          work_date: yyyymm,
          needed_per_shift: 5

        
    });
      console.log('서버 응답:', response.data.output_msg);
      alert('서버 응답:' + response.data.output_msg);
      if(response.data.output_msg == '저장되었습니다'){
        selectRow();
        sideSelectRow();
    }
    } catch (error) {
      console.error('서버에 데이터 전송 중 오류:', error);
      alert('서버 에러응답:' + response.data.output_msg);
    }
  }


  const onCellKeyDown = (event) => {
    const selectedCell = gridApi.current[1].getFocusedCell(); 
    const rowNode = gridApi.current[1].getDisplayedRowAtIndex(selectedCell.rowIndex);
    console.log("event.event.code=" + event.event.code);
    if(event.event.code =='KeyD'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'D');
      gridApi.current[1].tabToNextCell(event);
    }
    else if(event.event.code =='KeyE'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'E');
      gridApi.current[1].tabToNextCell(event);
    }
    else if(event.event.code =='KeyO'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'O');
      gridApi.current[1].tabToNextCell(event);
    }
    else if(event.event.code =='KeyN'){
      rowNode.setDataValue(selectedCell.column.getColId(), 'N');
      gridApi.current[1].tabToNextCell(event);
    }
    

    
  };
  
    // 셀 값이 변경되었을 때 호출되는 이벤트
    const onCellValueChanged = (event, gridIndex) => {
      const newValue = event.newValue; // 새로 변경된 값
      const rowNode = event.node; // 해당 행의 rowNode
      
    
      
      
      console.log('gridIndex'+gridIndex);
      console.log('rowNode'+rowNode);
    //   const allData = [];
    //   gridApi.current[1].forEachNode((node) => {
    //       allData.push(node.data); // 각 행의 데이터를 배열에 추가
    //   });
      
    //   console.log("변경시받아오는데이터:", allData);
    //   // rawData (데이터)를 처리하고 변환된 데이터를 그리드에서 사용할 수 있는 형태로 바꿈
    // const processedData = processData(allData);
    // const rowDataForGrid = transformedData(processedData);
    
    // console.log(rowDataForGrid);
    // setUnderRowData(rowDataForGrid);
    selectUnderGrid();
    };

      const backMonth = () => {
        setMonth(prev => prev - 1);
        
      };

    // const backMonth = () => {
    //   console.log('yyyymm1' + yyyymm);
    //   const newMonth = month - 1;
    //   setMonth(newMonth);
    
    //   const dateHeaders = generateDateHeaders(); // 새 날짜 컬럼 생성
    
    //   setColumnDefs(prevDefs => {
    //     // 기존 날짜 컬럼 제거
    //     const baseCols = prevDefs.filter(col => !col.isDynamic);
    //     // 제거한 다음 새 날짜 컬럼 추가
    //     return [...baseCols, ...dateHeaders];
    //   });
    
    //   selectRow();
      //sideSelectRow(); // 행 선택
    //   console.log('yyyymm2' + yyyymm);
    // };
    

    const addMonth = () =>{
      setMonth(month +1);
      const dateHeaders = generateDateHeaders();
      setColumnDefs(prevDefs => {
        // 기존 날짜 컬럼 제거
        const baseCols = prevDefs.filter(col => !col.isDynamic);
        // 제거한 다음 새 날짜 컬럼 추가
        return [...baseCols, ...dateHeaders];
      });
    console.log('yyyymm' + yyyymm);
      selectRow();
      sideSelectRow();
    }


    const handleRun = () => {
      setOpen(false);
      alert('최적화 완료!');
    };
    const onBtExport = useCallback(() => {
      gridRef.current[1].api.exportDataAsExcel();
    }, []);

    const processData = (rawData) => {
      // 결과를 저장할 객체
      const result = {};
    
      // 각 날짜 (1일 ~ 31일)에 대한 근무 유형 카운트를 처리
      const days = Array.from({ length: 31 }, (_, i) => i + 1);  // 1~31일
    
      days.forEach((day) => {
        result[day] = {
          D: 0,  // D의 개수
          E: 0,  // E의 개수
          N: 0,  // N의 개수
          O: 0,  // O의 개수
        };
      });
    
      // rawData에서 각 간호사의 근무 데이터를 순회하며 카운트
      rawData.forEach((nurse) => {
        // 각 날짜 (1일 ~ 31일)에 대해 값을 확인
        days.forEach((day) => {
          const workType = nurse[day]; // 해당 날짜에 해당하는 근무 유형 (D, E, N, O)
          if (workType) {
            // 해당 날짜에 해당하는 근무 유형 카운트 증가
            result[day][workType]++;
          }
        });
      });
    
      return result;
    };
    
    // 변환된 데이터를 기반으로 그리드에 표시할 데이터 형태로 변환
    const transformedData = (processedData) => {
      const workTypes = ['D', 'E', 'N', 'O'];
      const rows = workTypes.map((type) => {
        const row = { type };  // 근무유형 (D, E, N, O)
        for (let day = 1; day <= lastDay; day++) {
          row[day] = processedData[day][type];  // 해당 날짜에 대한 근무 유형 카운트
        }
        return row;
      });
    
      return rows;
    };
    
    const selectUnderGrid = () => {

      const allData = [];
      gridApi.current[1].forEachNode((node) => {
          allData.push(node.data); // 각 행의 데이터를 배열에 추가
      });
      
      console.log("변경시받아오는데이터:", allData);
      // rawData (데이터)를 처리하고 변환된 데이터를 그리드에서 사용할 수 있는 형태로 바꿈
    const processedData = processData(allData);
    const rowDataForGrid = transformedData(processedData);
    
    console.log(rowDataForGrid);
    setUnderRowData(rowDataForGrid);

    };

    const onBtnExport = useCallback(() => {
      gridApi.current[1].exportDataAsCsv();
    }, []);
    




    return (
      
      <div>
        <div class="header-container">
          <div class="button-title-group">
            <button class="nav-button" onClick={backMonth}>{month-1}월</button>
            <h2>{month}월 듀티표</h2>
            <button class="nav-button" onClick={addMonth}>{month+1}월</button>
          </div>
        </div>  
        <div>
          <a>전달 근무</a>
          <button id='defBut' onClick={createDuty} style={{ position: 'relative',left: `1180px`, }}>
                생성
          </button>
          <button id='defBut' onClick={deletAllData} style={{ position: 'relative',left: `1180px`, }}>
            초기화
          </button>
          <button id='defBut' onClick={sendDataToServer} style={{ position: 'relative',left: `1180px`, }}>
            저장
          </button>
          <button id='defBut'onClick={() => setOpen(true)} style={{ position: 'relative',left: `1180px`, }}>
            최적화
          </button>
          <button id='defBut'onClick={onBtnExport} style={{ position: 'relative',left: `1180px`, }}>
          표 다운
          </button>
          <OptimizeDialog open={open} onClose={() => setOpen(false)} onRun={handleRun} yyyymm ={yyyymm}/>
        </div>
            <div style={{ display: 'flex' }}>
            <div className="ag-theme-alpine" style={{ height: 400, width: '200px'}}>
      <AgGridReact
           ref={(el) => gridRef.current[0] = el}
          columnDefs={sideColumnDefs}
          rowData={sideRowData}
          onGridReady={(params) => onGridReady(params, 0)}
          modules={[AllCommunityModule]}
          onCellKeyDown={onCellKeyDown} // 키 이벤트 처리
          onCellValueChanged={(params) => onCellValueChanged(params, 0)}
          suppressClipboardPaste={false} // 붙여넣기 허용
          rowSelection="multiple"       // 다중 선택 모드
          defaultColDef={{
            sortable: false,   // ✅ 헤더 정렬 비활성화
            resizable: true,
          }}
      />
      </div>
            <div className="ag-theme-alpine" style={{  marginLeft: '10px',height: 400, width: '1477px'}}>
      <AgGridReact
           ref={(el) => gridRef.current[1] = el}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={(params) => onGridReady(params, 1)}
          modules={[AllCommunityModule]}
          onCellKeyDown={onCellKeyDown} // 키 이벤트 처리
          onCellValueChanged={(params) => onCellValueChanged(params, 1)}
          suppressClipboardPaste={false} // 붙여넣기 허용
          defaultColDef={{
            sortable: false,   // ✅ 헤더 정렬 비활성화
            resizable: true,
          }}
          cellSelection={false}
          rowSelection="multiple"       // 다중 선택 모드
      />
      </div>
      </div>
      <div className="ag-theme-alpine" style={{  marginTop: '50px', marginLeft: '210px',height: 150, width: '1477px'}}>
      <AgGridReact
           ref={(el) => gridRef.current[2] = el}
          columnDefs={underColumnDefs}
          rowData={underRowData}
          onGridReady={(params) => onGridReady(params, 2)}
          modules={[AllCommunityModule]}
          onCellKeyDown={onCellKeyDown} // 키 이벤트 처리
          onCellValueChanged={(params) => onCellValueChanged(params, 2)}
          suppressClipboardPaste={false} // 붙여넣기 허용
          rowSelection="multiple"       // 다중 선택 모드
          defaultColDef={{
            sortable: false,   // ✅ 헤더 정렬 비활성화
            resizable: true,
          }}
      />
      </div>
  </div>
  
    );
  };
  
  export default NurseSchedule;
  