import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import ProgressWidget from './ProgressWidget';
import ChartComponent from './ChartComponent';
import LoaderComponent from './LoaderComponent';

class PageHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    componentDidMount() {
        $.when(
            $.get("/api.php?r=charts"),
            $.get("/api.php?r=apartments"),
            $.get("/api.php?r=tenantsInApartment")
        ).then((chartsData, apartments, tenantsInApartment) => {
            var allRooms = 0;
            var occupied = 0;
            apartments[0].map((apartment) => {
                allRooms += apartment.rooms;
            });
            tenantsInApartment[0].map((el) => {
                if (el.apartment_id !== 0) {
                    occupied += el.count;
                }
            });
            this.setState(() => {
                return {
                    data: Object.values(chartsData[0]),
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
            val: "12999zł",
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
