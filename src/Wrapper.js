import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'

import StructureHeader from './StructureHeader';
import StructureTheme from './StructureTheme';
import MMenu from './MMenu';
import PageHome from './PageHome';
import PageTenants from './PageTenants';
import PageTenant from './PageTenant';
import PageFinance from './PageFinance';
import PageApartments from './PageApartments';

const menuElements = [
    ['home', PageHome, 'pe-7s-home', 'Strona główna'],
    ['apartments', PageApartments, 'pe-7s-world', 'Nieruchomości'],
    ['tenants', PageTenants, 'pe-7s-users', 'Najemcy', PageTenant],
    ['finance', PageFinance, 'pe-7s-cash', 'Finanse']
];

class Wrapper extends React.Component {
    constructor() {
        super();
        this.state = false;
    }
    route() {
        menuElements.map((page, index) => {
            var url = window.location.hash.substr(1).split("/");
            if (url[0] == page[0]) {
                this.showPage(page);
            }
            else if (!url[0]) {
                this.showPage(menuElements[0]);
            }
        })
        $(".hamburger.is-active").click();
    }
    componentDidMount() {
        this.route();
        $(window).bind("hashchange", () => {this.route()});
    }
    generatePageComponent(pageArr) {
        return {
            subPage: window.location.hash.includes("/") ? pageArr[4] : pageArr[1],
            subPageProps: {
                showAddButton: false,
                showBreadcrumbs: pageArr[0] !== "home",
                dataTitle: pageArr[3],
                dataIcon: pageArr[2]
            }
        }
    }
    showPage(pageArr) {
        this.setState((prevState, props) => {
            return this.generatePageComponent(pageArr)
        });
    }
    render() {
        return (
            <React.Fragment>
                <StructureHeader />
                <StructureTheme />
                <div className="app-main">
                    <div className="app-sidebar sidebar-shadow">
                        <div className="app-header__logo">
                            <div className="logo-src"></div>
                            <div className="header__pane ml-auto">
                                <div>
                                    <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                        <span className="hamburger-box">
                                            <span className="hamburger-inner"></span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="app-header__mobile-menu">
                            <div>
                                <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                                    <span className="hamburger-box">
                                        <span className="hamburger-inner"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="app-header__menu">
                            <span>
                                <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                                    <span className="btn-icon-wrapper">
                                        <i className="fa fa-ellipsis-v fa-w-6"></i>
                                    </span>
                                </button>
                            </span>
                        </div>
                        <div className="scrollbar-sidebar">
                            <div className="app-sidebar__inner"><MMenu menuElements={menuElements} /></div>
                        </div>
                    </div>
                    <div className="app-main__outer">{this.state.subPage && <this.state.subPage headerData={this.state.subPageProps} />}</div>
                </div>
            </React.Fragment>
        )
    }
}

export default Wrapper;
