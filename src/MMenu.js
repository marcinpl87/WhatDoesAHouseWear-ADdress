import React from 'react';
import ReactDOM from 'react-dom';

class MMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="vertical-nav-menu">
                <li className="app-sidebar__heading">Menu</li>
                {this.props.menuElements.map((val, index) => {
                    var aClass = "";
                    if ((!window.location.hash.substr && val[0] == "home") || (!window.location.hash.substr(1) && val[0] == "home") || (window.location.hash.substr(1) == val[0])) {
                        aClass = "mm-active";
                    }
                    var href = val[0] == "home" ? "#" : "#"+val[0];
                    return val[3] && <li key={index}>
                        <a href={href} className={aClass}>
                            <i className={`metismenu-icon ${val[2]}`}></i>{val[3]}
                        </a>
                    </li>
                })}
            </ul>
        )
    }
}

export default MMenu;
