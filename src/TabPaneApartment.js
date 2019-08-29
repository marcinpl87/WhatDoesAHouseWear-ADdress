import React from 'react';
import ReactDOM from 'react-dom';

import LoaderComponent from './LoaderComponent';
import ProgressWidget from './ProgressWidget';
import MTable from './MTable';

class TabPaneApartment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    createTableStructure(data) {
        return {
            title: false,
            clickableHash: "tenants",
            headers: ["Id", "Imię", "Nazwisko", "Mieszkanie", "Pokój", "Saldo"],
            rows: data.map(x => Object.values(x))
        };
    }
    componentDidMount() {
        $.get("/api.php?r=tenants", (data) => {
            this.setState((prevState, props) => {
                return {
                    data: this.createTableStructure(data)
                }
            });
        });
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
                        <div className="main-card mb-3 card">
                            {this.state.data ? <React.Fragment>
                                <MTable tableData={this.state.data} />
                            </React.Fragment> : <LoaderComponent />}
                        </div>
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
