import React from 'react';
import ReactDOM from 'react-dom';

import TabPaneApartment from './TabPaneApartment';
import TabsComponent from './TabsComponent';
import LoaderComponent from './LoaderComponent';
import Utils from './Utils';

class ApartmentsTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
    }
    createTableStructure(data, tenantsInApartment) {
        var config = [];
        var tenantsInApartmentFlat = tenantsInApartment.map(x => Object.values(x));
        data.map((apartment) => {
            var occupiedRooms = Utils.findArrValById(
                tenantsInApartmentFlat,
                apartment.id
            );
            config.push([TabPaneApartment, apartment.name, {
                id: "tab-eg14-"+apartment.id,
                notes: apartment.notes,
                contracts: {
                    title: "Podpisane umowy",
                    subTitle: false,
                    val: occupiedRooms,
                    valGreen: true,
                    percentage: Math.round(occupiedRooms / apartment.rooms * 100),
                    percentageGreen: false,
                },
                payments: {
                    title: "Płatności",
                    subTitle: "Opłacone w tym miesiącu",
                    val: (Utils.findArrValById(tenantsInApartmentFlat, apartment.id, 2) || 0) + "zł",
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
                        ["Nazwa", ["text", "name"]],
                        ["Adres", ["text", "address"]],
                        ["Piętro", [
                            "list",
                            "floor",
                            [[1, "1"], [2, "2"], [3, "3"], [4, "4"]]
                        ]],
                        ["Domofon", ["text", "code"]],
                        ["Wkładka w drzwiach zewnętrznych", ["text", "lock_out"]],
                        ["Wkładka w drzwiach wewnętrznych", ["text", "lock_in"]],
                        ["Sejf", ["text", "safe"]],
                        ["Wifi", ["text", "wifi_ssid"]],
                        ["Wifi hasło", ["text", "wifi_pass"]],
                        ["Notatki", ["text", "notes"]]
                    ]
                },
                insurance: {
                    title: "Ubezpieczenie",
                    headers: ["Numer polisy", "Nazwa firmy", "Data ważności"],
                    rowsData: apartment,
                    rows: [[
                        ["text", "insurance_number"],
                        ["text", "insurance_name"],
                        ["date", "insurance_date"]
                    ]]
                }
            }]);
        });
        return config;
    }
    componentDidMount() {
        $.when(
            Utils.ajax("get", "apartments"),
            $.get("/api.php?r=tenantsInApartment")
        ).then((dataApartments, tenantsInApartment) => {
            this.setState(() => {
                return {
                    data: this.createTableStructure(
                        dataApartments[0].apartments,
                        tenantsInApartment[0]
                    )
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
