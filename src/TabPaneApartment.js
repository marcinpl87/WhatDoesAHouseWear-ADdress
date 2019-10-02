import React from 'react';
import ReactDOM from 'react-dom';

import TenantsComponent from './TenantsComponent';
import ProgressWidget from './ProgressWidget';
import MTable from './MTable';

class TabPaneApartment extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6">
                        <ProgressWidget widgetData={this.props.paneData.contracts} />
                    </div>
                    <div className="col-md-6">
                        <ProgressWidget widgetData={this.props.paneData.payments} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="main-card mb-3 card">
                            <MTable tableData={this.props.paneData.properties} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="main-card mb-3 card">
                            <MTable tableData={this.props.paneData.insurance} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TenantsComponent apartmentId={this.props.paneData.properties.id} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {this.props.paneData.notes &&
                            <div className="card-shadow-info border mb-3 card card-body border-info">
                                <h5 className="card-title">Notatki</h5>
                                {this.props.paneData.notes.split('\n').map((item, i) => {
                                    return <span key={i}>{item}<br /></span>;
                                })}
                            </div>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TabPaneApartment;
