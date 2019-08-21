import React from 'react';
import ReactDOM from 'react-dom';

import MTable from './MTable';

class TabPaneTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="main-card mb-3 card">
                <MTable tableData={this.props.paneData} />
            </div>
        )
    }
}

export default TabPaneTable;
