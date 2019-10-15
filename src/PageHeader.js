import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

import HeaderBreadcrumbs from './HeaderBreadcrumbs';

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="app-page-title app-page-title-simple">
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div>
                            <div className="page-title-subheading opacity-10">
                                {this.props.showBreadcrumbs
                                    ? <HeaderBreadcrumbs />
                                    : <React.Fragment>&nbsp;</React.Fragment>}
                            </div>
                            <div className="page-title-head center-elem">
                                <span className="d-inline-block pr-2">
                                    <i className={this.props.dataIcon} />
                                </span>
                                <span className="d-inline-block">
                                    {this.props.dataTitle}
                                </span>
                            </div>
                        </div>
                    </div>
                    {this.props.showAddButton && <div className="page-title-actions">
                        <button type="button" className="btn-shadow mr-3 btn btn-success" onClick={this.props.add}>
                            <i className="fa fa-fw"></i>
                        </button>
                    </div>}
                </div>
            </div>
        )
    }
}

export default PageHeader;
