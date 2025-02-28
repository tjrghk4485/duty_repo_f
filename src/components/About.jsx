import React, { useState,useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './css/Menu.css'
import axios from 'axios';

// AG-Grid에서 필요한 모듈을 import
import { AllCommunityModule } from 'ag-grid-community';

const About = () => {
    const gridApi = useRef(null);
    const columnApi = useRef(null);
    const [rowData, setRowData] = useState([
    //     {
    //     DELETE: false,
    //     PARENT_ID: 'user123',
    //     STATUS: null,
    //     NURSE_ID: 'NUR001',
    //     NURSE_NM: '홍길동',
    //     USE_YN: true
    // },
    // {
    //     DELETE: false,
    //     PARENT_ID: 'user456',
    //     STATUS: null,
    //     NURSE_ID: 'NUR002',
    //     NURSE_NM: '김철수',
    //     USE_YN: true
    // },
    // {
    //     DELETE: false,
    //     PARENT_ID: 'user789',
    //     STATUS: null,
    //     NURSE_ID: 'NUR003',
    //     NURSE_NM: '이영희',
    //     USE_YN: false
    // }
]); // useState로 수정 
    
    
    

  
    
    

    const onGridReady = (params) => {
        
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        gridApi.current.sizeColumnsToFit();

        axios.get('http://localhost:8080/bm/nurse/sel',{
            params: {
                id: 'a001'
            }
        })
        .then(response => {
            const modifiedData = response.data.map(item => ({
                ...item,
                DELETE: false
            }));
            setRowData(modifiedData);
        })
      .catch(error => alert('Error:', error));
    
    const allData = gridApi.current.getRenderedNodes().map(node => node.data);
    console.log("테이블데이터 =", allData);
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
        { headerName: "삭제", field: "DELETE",editable: true},
        { headerName: "사용자", field: "PARENT_ID", editable: true },
        { headerName: "상태", field: "STATUS", editable: false },
        { headerName: "간호사번호", field: "NURSE_ID", editable: true },
        { headerName: "이름", field: "NURSE_NM", editable: true },
        { headerName: "사용여부", field: "USE_YN", editable: true }
    ];
    //===============================잡기능==============================================//
    const addRow = () => {
        const newItem = {  DELETE: false,
            PARENT_ID: 'user123',
            STATUS: 'I',
            NURSE_ID: 'NUR001',
            NURSE_NM: '홍길동',
            USE_YN: true };
        setRowData([...rowData, newItem]);
    };


   

  const sendDataToServer = async () => {
    // gridApi가 초기화되었을 때만 호출
    if (gridApi.current) {
        // const selectedData = gridApi.current.getSelectedRows();  // 선택된 데이터 가져오기
        // console.log("selectedData =", selectedData);
        const allData = [];
        gridApi.current.forEachNode((node) => {
            allData.push(node.data); // 각 행의 데이터를 배열에 추가
        });
        
        console.log("전체 데이터:", allData);
        try {
            const response = await axios.post('http://localhost:8080/bm/nurse/mod', allData);
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('서버에 데이터 전송 중 오류:', error);
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
    //     console.log(`컬럼: ${colDef.field}, 변경 전 값: ${oldValue}, 변경 후 값: ${newValue}, data.id${data.DELETE}`);
        
        
    //     const rowId = event.node.id;
    //     // DELETE 선택시 해당 상태 삭제로 변경경
    //     if(colDef.field == "DELETE"){
    //         if(newValue == true){
    //             const updatedData = { ...event.data, "STATUS": "D" }; // b 컬럼의 값을 변경
    //             const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //             rowNode.setData(updatedData);     
    //             gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //             }else if(newValue == false){
    //                 const updatedData = { ...event.data, "STATUS": null }; // b 컬럼의 값을 변경
    //                 const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //                 rowNode.setData(updatedData);
    //                 gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //                 }
    //     }else if(colDef.field != "STATUS" && event.data.STATUS != 'I'){
    //         console.log("event.data.STATUS" + event.data.STATUS);
    //         const updatedData = { ...event.data, "STATUS": "U" }; // b 컬럼의 값을 변경
    //         const rowNode = gridApi.current.getRowNode(event.node.id); // 업데이트할 행 노드를 찾아서 데이터 업데이트
    //         rowNode.setData(updatedData);     
    //         gridApi.current.refreshCells({ rowNodes: [rowNode], force: true }); // 변경된 셀 리렌더링
    //         }


    //   };


      const onCellValueChanged = (event) => {
        const { oldValue, newValue, data, colDef } = event;
        console.log(`컬럼: ${colDef.field}, 변경 전 값: ${oldValue}, 변경 후 값: ${newValue}, data.id: ${data.DELETE}`);
        
        // 전체 rowData를 한 번에 갱신 (기존 rowData와 변경된 값만 반영)
        setRowData((prevRowData) => {
            return prevRowData.map((row) => {
                if (row.NURSE_ID === data.NURSE_ID) {
                    // DELETE 선택 시 상태 변경
                    if (colDef.field === "DELETE") {
                        return { ...row, "DELETE": newValue, "STATUS": newValue ? "D" : null };
                    } 
                    // DELETE가 아니고 STATUS가 "I"가 아닌 경우
                    else if (colDef.field !== "STATUS" && data.STATUS !== 'I') {
                        return { ...row, [colDef.field]: newValue, "STATUS": "U" };
                    }
                }
                return row; // 나머지 행은 그대로
            });
        });
    };


   //=================================그리드이벤트=========================================//
    return (
        <div className="main-content">
            <h2>About Page with AG-Grid</h2>
            <div className="absolute top-0 right-0">
            <button onClick={sendDataToServer} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Export Data
            </button>
            <button onClick={addRow}>행 추가</button>
        </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: '1200px' }}>
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

export default About;
