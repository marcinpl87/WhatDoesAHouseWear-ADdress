import React from 'react';
import ReactDOM from 'react-dom';

import CsvUploadComponent from './CsvUploadComponent';
import CategoriseTransactionsComponent from './CategoriseTransactionsComponent';

class TabPaneUpload extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <CsvUploadComponent paneData={this.props.paneData} />
                </div>
                <div className="row">
                    <CategoriseTransactionsComponent paneData={this.props.paneData} />
                </div>
            </React.Fragment>
        )
    }
}

export default TabPaneUpload;
