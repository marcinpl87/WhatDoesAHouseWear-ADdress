import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import ProgressWidget from './ProgressWidget';
import ChartComponent from './ChartComponent';
import LoaderComponent from './LoaderComponent';
import Utils from './Utils';

class PageHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            rents: 0,
            occupiedRooms: 0,
            occupiedRoomsPercentage: 0,
        };
    }
    componentDidMount() {
        $.when(
            Utils.ajax("get", "config/2"),
            Utils.ajax("get", "apartments"),
            Utils.ajax("get", "tenantsStats")
        ).then((chartsData, apartments, stats) => {
            var allRooms = 0;
            var occupied = 0;
            var rents = 0;
            apartments[0].apartments.map((apartment) => {
                allRooms += parseInt(apartment.rooms);
            });
            stats[0].stats.map((el) => {
                if (el.apartment_id !== 0) {
                    occupied += parseInt(el.count);
                    rents += parseInt(el.rents);
                }
            });
            this.setState(() => {
                return {
                    data: Object.values(JSON.parse(chartsData[0].config[0].val)),
                    rents: rents,
                    occupiedRooms: occupied,
                    occupiedRoomsPercentage: Math.round(occupied / allRooms * 100)
                }
            });
        });
    }
    render() {
        var dataContracts = {
            title: "Podpisane umowy",
            subTitle: false,
            val: this.state.occupiedRooms,
            valGreen: true,
            percentage: this.state.occupiedRoomsPercentage,
            percentageGreen: false,
        }
        var dataPayments = {
            title: "Płatności",
            subTitle: "Opłacone w tym miesiącu",
            val: (this.state.rents || 0) + "zł",
            valGreen: false,
            percentage: "100",
            percentageGreen: true,
        }
        return (
            <div className="app-main__inner">
                <PageHeader {...this.props.headerData} />
                <div className="row">
                    <div className="col-md-6">
                        <ProgressWidget widgetData={dataContracts} />
                    </div>
                    <div className="col-md-6">
                        <ProgressWidget widgetData={dataPayments} />
                    </div>
                </div>
                {this.state.data ? this.state.data.map((c, i) => {
                    return <div className="row" key={i}>

                        <div className="col-md-12">
                            <ChartComponent config={c} />
                        </div>
                    </div>
                }) : <LoaderComponent />}
            </div>
        )
    }
}

export default PageHome;
