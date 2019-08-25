import React from 'react';
import ReactDOM from 'react-dom';

import TabPaneTable from './TabPaneTable';

class TaxPane extends React.Component {
    constructor(props) {
        super(props);
    }
    mRound(num, position = 2) {
        return Number(parseFloat(num).toFixed(position));
    }
    render() {
        var sum = 0;
        var sumArr = [];
        this.props.paneData.data.transactions.map((el) => {
            if (el.category_id == 5) {
                sumArr.push(this.mRound(el.value));
                sum = this.mRound(sum) + this.mRound(el.value);
            }
        });
        var msg = sumArr.length + " transakcji:\n"
        + sumArr.join("zł + ") + "zł = "
        + this.mRound(sum) + "\n\n"
        + this.mRound(sum) + " * 0,085 = "
        + this.mRound(sum*0.085) + " = "
        + this.mRound(sum*0.085, 0 );
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card-shadow-info border mb-3 card card-body border-info">
                            <h5 className="card-title">Podatek</h5>
                            {msg.split('\n').map((item, i) => {
                                return <span key={i}>{item}<br /></span>;
                            })}
                        </div>
                    </div>
                </div>
                <TabPaneTable paneData={this.props.paneData} />
            </React.Fragment>
        )
    }
}

export default TaxPane;
