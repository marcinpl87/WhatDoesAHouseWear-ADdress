import React from 'react';
import ReactDOM from 'react-dom';

import EditableCell from './EditableCell'

class MTable extends React.Component {
    constructor(props) {
        super(props);
        this.goToSubPage = this.goToSubPage.bind(this);
    }
    goToSubPage(id) {
        if (this.props.tableData.clickableHash) {
            window.location.hash = "#" + this.props.tableData.clickableHash + "/" + id;
        }
    }
    render() {
        return (
            <div className="card-body">
                {this.props.tableData.title &&
                    <h5 className="card-title">{this.props.tableData.title}</h5>
                }
                <div className={`table-responsive ${this.props.tableData.class}`}>
                    <table className={`mb-0 table table-striped table-hover ${this.props.tableData.clickableHash && "clickable"}`}>
                        {this.props.tableData.headers &&
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {this.props.tableData.headers.map((val, index) => {
                                        return <th key={index}>{val}</th>
                                    })}
                                </tr>
                            </thead>
                        }
                        <tbody>
                            {this.props.tableData.rows.map((val, index) => {
                                return <tr key={index} onClick={() => this.goToSubPage(val[0])}>
                                    <th scope="row">{index+1}</th>
                                    {val.map((cellVal, cellIndex) => {
                                        return <td key={cellIndex}>{Array.isArray(cellVal)
                                            ? <EditableCell
                                                cellName={cellVal[0]}
                                                cellVal={this.props.tableData.rowsData[cellVal[0]]}
                                                cellChoices={cellVal[1]}
                                                cellId={this.props.tableData.id}
                                                cellTable={this.props.tableData.dbTable}
                                            />
                                            : cellVal}</td>
                                    })}
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default MTable;
