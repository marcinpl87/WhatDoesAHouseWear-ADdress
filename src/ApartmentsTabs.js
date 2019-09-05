import React from 'react';
import ReactDOM from 'react-dom';

import TabPaneApartment from './TabPaneApartment';
import TabsComponent from './TabsComponent';
import LoaderComponent from './LoaderComponent';

class ApartmentsTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    createTableStructure(data) {
        var config = [];
        data.map((apartment) => {
            config.push([TabPaneApartment, apartment.name, {
                id: "tab-eg14-"+apartment.id,
                notes: apartment.notes,
                contracts: {
                    title: "Podpisane umowy",
                    subTitle: false,
                    val: "1",
                    valGreen: true,
                    percentage: "20",
                    percentageGreen: false,
                },
                payments: {
                    title: "Płatności",
                    subTitle: "Opłacone w tym miesiącu",
                    val: "4500zł",
                    valGreen: false,
                    percentage: "100",
                    percentageGreen: true,
                },
                properties: {
                    dbTable: "apartments",
                    id: apartment.id,
                    title: "Dane",
                    rowsData: apartment,
                    rows: [
                        ["Adres", ["address"]],
                        ["Piętro", [
                            "floor",
                            [[1, "1"], [2, "2"], [3, "3"], [4, "4"]]
                        ]],
                        ["Domofon", ["code"]]
                    ]
                },
                insurance: {
                    title: "Ubezpieczenie",
                    headers: ["Numer polisy", "Nazwa firmy", "Data ważności"],
                    rowsData: apartment,
                    rows: [[["insurance_number"], ["insurance_name"], ["insurance_date"]]]
                }
            }]);
        });
        return config;
    }
    componentDidMount() {
        $.get("/api.php?r=apartments", (data) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(data)
                }
            });
        });
    }
    render() {
        return (
            <React.Fragment>
                {this.state.data
                    ? <TabsComponent tabsConfig={this.state.data} />
                    : <LoaderComponent />
                }
            </React.Fragment>
        )
    }
}

export default ApartmentsTabs;
