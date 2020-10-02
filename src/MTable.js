import React from 'react';
import ReactDOM from 'react-dom';

import EditableCell from './EditableCell'

class MTable extends React.Component {
    constructor(props) {
        super(props);
        this.sort = this.sort.bind(this);
        this.goToSubPage = this.goToSubPage.bind(this);
        this.state = {
            rows: this.props.tableData.rows,
        };
    }
    goToSubPage(id) {
        if (this.props.tableData.clickableHash) {
            window.location.hash = "#" + this.props.tableData.clickableHash + "/" + id;
        }
    }
    sort(i) {
        if (this.props.tableData.headers) {
            this.setState(() => {
                return {
                    rows: this.state.rows.sort((a, b) => {
                        if (a[i] < b[i]) return -1;
                        if (a[i] > b[i]) return 1;
                        return 0;
                    })
                };
            });
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
                                        return <th key={index} onClick={() => this.sort(index)}>{val}</th>
                                    })}
                                </tr>
                            </thead>
                        }
                        <tbody>
                            {this.state.rows.map((val, index) => {
                                return <tr key={index} onClick={() => this.goToSubPage(val[0])}>
                                    <th scope="row">{index+1}</th>
                                    {val.map((cellVal, cellIndex) => {
                                        return <td key={cellIndex}>{Array.isArray(cellVal)
                                            ? <EditableCell
                                                cellConfig={cellVal}
                                                cellData={this.props.tableData.rowsData[cellVal[1]]}
                                                cellId={this.props.tableData.id}
                                                cellTable={this.props.tableData.dbTable}
                                                cellEditCallback={this.props.tableData.callback}
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
