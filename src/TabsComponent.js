import React from 'react';
import ReactDOM from 'react-dom';

import TabLink from './TabLink';
import TabPane from './TabPane';

class TabsComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <ul className="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
                    {this.props.tabsConfig.map((val, index) => {
                        return <TabLink
                            key={index}
                            dataHref={`#szon-tab${index}`}
                            dataAnchor={val[1]}
                            dataActive={index==0}
                        />
                    })}
                </ul>
                <div className="tab-content">
                    {this.props.tabsConfig.map((val, index) => {
                        return <TabPane
                            key={index}
                            dataId={`szon-tab${index}`}
                            paneComponent={val[0]}
                            paneData={val[2]}
                            dataActive={index==0}
                        />
                    })}
                </div>
            </React.Fragment>
        )
    }
}

export default TabsComponent;
