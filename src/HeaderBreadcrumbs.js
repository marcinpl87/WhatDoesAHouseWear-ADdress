import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

class HeaderBreadcrumbs extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <nav className="" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#">
                            <i className="pe-7s-home" />
                        </a>
                    </li>
                    <li className="breadcrumb-item">&nbsp;</li>
                </ol>
            </nav>
        )
    }
}

export default HeaderBreadcrumbs;
