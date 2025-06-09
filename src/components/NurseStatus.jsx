import React, { useState,useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './css/Menu.css'
import axios from 'axios';
import * as XLSX from 'xlsx'; 

// AG-Grid에서 필요한 모듈을 import
import { AllCommunityModule } from 'ag-grid-community';

const NurseStatus = () => {
    const gridApi = useRef(null);
    const columnApi = useRef(null);
    const [rowData, setRowData] = useState([]); // useState로 수정 
    const [excelData, setExcelData] = useState([]);
    const keyMap = {
        "삭제": "delete",
        "상태": "status",
        "사용자": "parent_id",
        "간호사번호": "nurse_id",
        "이름": "nurse_nm",
        "근무시작일": "start_date",
        "선호근무": "keep_type",
        "사용여부": "use_yn",
      };
    

    const onGridReady = (params) => {
        console.log("localStorage=" + localStorage.getItem("kakaoId"));
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        gridApi.current.sizeColumnsToFit();

    //     axios.get('http://localhost:3001/bm/nurse/sel',{
    //         params: {
    //             parent_id: '100'
    //         }
    //     })
    //     .then(response => {
    //         const modifiedData = response.data.map(item => ({
    //             ...item,
    //             delete: false
    //         }));
    //         setRowData(modifiedData);
    //     })
    //   .catch(error => alert('Error:', error));
    selectRow();
    const allData = gridApi.current.getRenderedNodes().map(node => node.data);
    console.log("테이블데이터 =", allData);
    getRowData();
    };

    // 리사이즈 시 컬럼 크기 자동 조정
    const onGridSizeChanged = () => {
        if (gridApi.current) {
            gridApi.current.sizeColumnsToFit();
        }
    };

    // 셀 편집 완료 후 호출되는 이벤트
    const onCellEditCommit = (event) => {
        console.log('수정된 데이터:', event.data);
    };

    

    const columns = [
        { headerName: "삭제", field: "delete",editable: true},
        { headerName: "상태", field: "status", editable: false },
        { headerName: "사용자", field: "parent_id", editable: true },
        { headerName: "간호사번호", field: "nurse_id", editable: true },
        { headerName: "이름", field: "nurse_nm", editable: true },
        { headerName: "근무시작일", field: "start_date", editable: true },
        { headerName: "선호근무", field: "keep_type",  editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
              values: ['D', 'E', 'N','X'],
            }},
        { headerName: "사용여부", field: "use_yn", editable: true }
    ];
    //===============================잡기능==============================================//
    const addRow = () => {
        getRowData();
        const newItem = {   delete: false,
                            status: 'I',
                            parent_id: localStorage.getItem('userId'),
                            keep_type: 'X',
                            use_yn: false 
                        };
        setRowData([...rowData, newItem]);
    };

    const selectRow = () => {
        axios.get('http://localhost:3001/nurse/sel',{
            params: {
                parent_id: localStorage.getItem('userId')
            }
        })
        .then(response => {
            const modifiedData = response.data.map(item => ({
                ...item,
                delete: false
            }));
            setRowData(modifiedData);
        })
      .catch(error => alert('Error:', error));
    
    const allData = gridApi.current.getRenderedNodes().map(node => node.data);
    console.log("테이블데이터 =", allData);
    };

    const getRowData = () => {
        
          const rowData = [];
          gridApi.current.forEachNode((node) => {
            rowData.push(node.data);
          });
          console.log("rowData=" + JSON.stringify(rowData[0])); // 로우 데이터를 콘솔에 출력
        
      };
   

  const sendDataToServer = async () => {

    if(!confirm('저장하시겠습니까?')) {
        return;
    }

    // gridApi가 초기화되었을 때만 호출
    if (gridApi.current) {
        // const selectedData = gridApi.current.getSelectedRows();  // 선택된 데이터 가져오기
        // console.log("selectedData =", selectedData);
        const allData = [];
        gridApi.current.forEachNode((node) => {
            if (node.data.status){
                allData.push(node.data); // 각 행의 데이터를 배열에 추가
            }
            
        });
        
        console.log("전체 데이터:", allData);
        try {
            const response = await axios.post('http://localhost:3001/nurse/mod', allData);
            console.log('서버 응답:', response.data.output_msg);
            alert('서버 응답:' + response.data.output_msg);
            if(response.data.output_msg == '저장되었습니다'){
                selectRow();
            }
            
        } catch (error) {
            console.log('서버에 데이터 전송 중 오류:', error.response);
            if (error.response && error.response.data && error.response.data.message) {
                // 서버가 예외 메시지를 JSON으로 내려준 경우
                alert('서버 에러응답: ' + error.response.data.message);
            } else {
                // 서버가 응답을 아예 안 했거나 알 수 없는 오류
                alert('서버 요청 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    } else {
        console.log("gridApi가 초기화되지 않았습니다.");
    }
};
    //===============================잡기능==============================================//
   //=================================그리드이벤트=========================================//
    // 체크박스를 클릭한 후 해당 행의 age만 업데이트
    const modifiedStates = useRef({});
    



    // const onCellValueChanged = (event) => {
    //     const { oldValue, newValue, data, colDef } = event;
    //     console.log(`컬럼: ${colDef.field}, 변경 전 값: ${oldValue}, 변경 후 값: ${newValue}, data.id${data.delete}`);
        
        
    //     const rowId = event.node.id;
    //     // delete 선택시 해당 상태 삭제로 변경경
    //     if(colDef.field == "delete"){
    //         if(newValue == true){
    //             const updatedData = { ...event.data, "status": "D" }; // b 컬럼의 값을 변경
    //             const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //             rowNode.setData(updatedData);     
    //             gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //             }else if(newValue == false){
    //                 const updatedData = { ...event.data, "status": null }; // b 컬럼의 값을 변경
    //                 const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //                 rowNode.setData(updatedData);
    //                 gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //                 }
    //     }else if(colDef.field != "status" && event.data.status != 'I'){
    //         console.log("event.data.status" + event.data.status);
    //         const updatedData = { ...event.data, "status": "U" }; // b 컬럼의 값을 변경
    //         const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //         rowNode.setData(updatedData);     
    //         gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //         }


    //   };


      const onCellValueChanged = (event) => {
        const { oldValue, newValue, data, colDef } = event;
        console.log(`컬럼: ${colDef.field}, 변경 전 값: ${oldValue}, 변경 후 값: ${newValue}, data.id: ${data.delete}`);
        
      


        // 전체 rowData를 한 번에 갱신 (기존 rowData와 변경된 값만 반영)
        setRowData((prevRowData) => {
            return prevRowData.map((row) => {
                if (row.nurse_id === data.nurse_id) {
                    // delete 선택 시 상태 변경
                    if (colDef.field === "delete") {
                        return { ...row, "delete": newValue, "status": newValue ? "D" : null };
                    } 
                    // delete가 아니고 status가 "I"가 아닌 경우
                    else if (colDef.field !== "status" && data.status !== 'I') {
                        return { ...row, [colDef.field]: newValue, "status": "U" };
                    }
                }
                return row; // 나머지 행은 그대로
            });
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
    
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
    
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          setExcelData(jsonData);
          console.log('엑셀 파싱 결과:', jsonData);
          console.log('기존로우데이터:', rowData);
          const convertedData = jsonData.map(convertKeys);
    setRowData([...rowData, ...convertedData]); // AG Grid에 적용
        };
    
        reader.readAsArrayBuffer(file);
        
      };

      const convertKeys = (row) => {
        const newRow = {};
        for (const [k, v] of Object.entries(row)) {
          newRow[keyMap[k] || k] = v;
        }
        return newRow;
      };


   //=================================그리드이벤트=========================================//
    return (
        <div className="main-content">
            <h2>간호사정보</h2>
            <div className="absolute top-0 right-0">
            <h5>엑셀 업로드</h5>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button id='defBut' onClick={sendDataToServer} style={{ position: 'relative',left: `690px`, }}>
                저장
            </button>
            <button id='defBut' onClick={addRow}style={{ position: 'relative',left: `690px`, }}>행 추가</button>
        </div>
            <div className="ag-theme-alpine" style={{ height: 200, width: '1200px' }}>
                <AgGridReact
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    rowData={rowData}
                    domLayout="autoHeight"
                    onGridSizeChanged={onGridSizeChanged}
                    modules={[AllCommunityModule]}
                    onCellEditCommit={onCellEditCommit}  // 셀 편집 완료 후 데이터 추적
                    onCellValueChanged={onCellValueChanged}
                    
                    
                />
            </div>
            
        </div>
    );
}

export default NurseStatus;
