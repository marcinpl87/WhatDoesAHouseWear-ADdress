import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';

class LoaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="vertical-center">
                <div className="container text-center">
                    <img
                        src={`${
                            $(".app-container").data("path")
                        }/assets/images/loading.gif`}
                    />
                </div>
            </div>
        )
    }
}

export default LoaderComponent;
