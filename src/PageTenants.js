import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import PageHeader from './PageHeader';
import TenantsComponent from './TenantsComponent';

class PageTenants extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="app-main__inner">
                <PageHeader {...this.props.headerData} />
                <div className="row">
                    <div className="col-md-12">
                        <TenantsComponent />
                    </div>
                </div>
            </div>
        )
    }
}

export default PageTenants;
