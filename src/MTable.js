import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

class MTable extends React.Component {
    constructor(props) {
        super(props);
        this.goToSubPage = this.goToSubPage.bind(this);
    }
    goToSubPage(row) {
        window.location.hash = "#tenants/" + row[0];
    }
    render() {
        return (
            <div className="card-body">
                {this.props.tableData.title &&
                    <h5 className="card-title">{this.props.tableData.title}</h5>
                }
                <div className={`table-responsive ${this.props.tableData.class}`}>
                    <table className="mb-0 table table-striped table-hover">
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
                                return <tr key={index} onClick={() => this.goToSubPage(val)}>
                                    <th scope="row">{index+1}</th>
                                    {val.map((cellVal, cellIndex) => {
                                        return <td key={cellIndex}>{cellVal}</td>
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