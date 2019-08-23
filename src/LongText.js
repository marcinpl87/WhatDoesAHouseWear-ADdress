import React from 'react';
import ReactDOM from 'react-dom';

class LongText extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var maxLength = 20;
        var myStr = this.props.text.toString();
        var short = myStr.substring(
            0, maxLength / 2
        ) + "..." + myStr.substr(
            myStr.length - maxLength / 2
        );
        return (
            <React.Fragment>
                {(myStr.length > maxLength) ?
                    <span data-toggle="tooltip" data-placement="top" title={myStr}>
                        {short}
                    </span> : <React.Fragment>{myStr}</React.Fragment>}
            </React.Fragment>
        )
    }
}

export default LongText;
