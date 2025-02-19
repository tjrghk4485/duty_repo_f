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
    const [rowData, setRowData] = useState([{"NURSE_ID": "간호사1","NURSE_NM": "간호사1","PARENT_ID":"A001"}]); // useState로 수정 
    
    


    const testA = rowData.map(item => ({
        ...item, STATUS: 'A',DELETE: 0
    })

    )
    
    

    const onGridReady = (params) => {
        
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        gridApi.current.sizeColumnsToFit();

    //     axios.get('http://localhost:8080/send',{
    //         params: {
    //             id: 'a001'
    //         }
    //     })
    //   .then(response => setRowData(response.data))
    //   .catch(error => alert('Error:', error));
    
    alert(JSON.stringify(testA));

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
        { headerName: "삭제", field: "DELETE", editable: true },
        { headerName: "사용자", field: "PARENT_ID", editable: true },
        { headerName: "상태", field: "STATUS", editable: true },
        { headerName: "간호사번호", field: "NURSE_ID", editable: true },
        { headerName: "이름", field: "NURSE_NM", editable: true },
        { headerName: "사용여부", field: "USE_YN", editable: true }
    ];

   

    return (
        <div className="main-content">
            <h2>About Page with AG-Grid</h2>
            <div className="absolute top-0 right-0">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Export Data
            </button>
        </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: '1200px' }}>
                <AgGridReact
                    onGridReady={onGridReady}
                    columnDefs={columns}
                    rowData={testA}
                    domLayout="autoHeight"
                    onGridSizeChanged={onGridSizeChanged}
                    modules={[AllCommunityModule]}
                    onCellEditCommit={onCellEditCommit}  // 셀 편집 완료 후 데이터 추적
                />
            </div>
        </div>
    );
}

export default About;
