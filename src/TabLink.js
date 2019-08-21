import React from 'react';
import ReactDOM from 'react-dom';

class TabLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <li className="nav-item">
                <a data-toggle="tab" role="tab" href={this.props.dataHref} className={`nav-link show ${this.props.dataActive ? "active" : ""}`}>
                    <span className="nav-text">
                        {this.props.dataAnchor}
                    </span>
                </a>
            </li>
        )
    }
}

export default TabLink;
