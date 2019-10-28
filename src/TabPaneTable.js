import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';

class TabPaneTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() { //I need random key for table to force constructor call for every re-render
        return (
            <div className="main-card mb-3 card">
                <MTable key={Math.floor(Math.random() * 999999)} tableData={this.props.paneData} />
            </div>
        )
    }
}

export default TabPaneTable;
