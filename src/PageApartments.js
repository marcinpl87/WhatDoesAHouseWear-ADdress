import React from 'react';
import ReactDOM from 'react-dom';

import PageHeader from './PageHeader';
import ApartmentsTabs from './ApartmentsTabs';

class PageApartments extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="app-main__inner">
                <PageHeader {...this.props.headerData} />
                <ApartmentsTabs />
            </div>
        )
    }
}

export default PageApartments;
