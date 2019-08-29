import React from 'react';
import ReactDOM from 'react-dom';

class ButtonDot extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button onClick={this.props.handleClick} className="mb-2 mr-2 btn btn-link">
                {this.props.buttonName}
                {this.props.dot &&
                    <span className={`
                        badge badge-dot badge-dot-lg badge-${this.props.buttonColor
                    }`}> </span>
                }
            </button>
        )
    }
}

export default ButtonDot;
