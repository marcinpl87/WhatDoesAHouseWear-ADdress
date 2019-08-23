import React from 'react';
import ReactDOM from 'react-dom';

class DropDownDot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.categorise = this.categorise.bind(this);
    }
    categorise(cat) {
        this.setState(() => {
            return {loading: true}
        });
        $.get("/api.php", {
            r: "categorise",
            id: this.props.transactionId,
            cat: cat
        }, (data) => {
            this.props.updateCat(cat);
        });
    }
    render() {
        var v = !!this.props.selectedCat
            ? {
                name: this.props.allObj[this.props.selectedCat].name,
                color: this.props.allObj[this.props.selectedCat].color
            }
            : {
                name: "Wybierz",
                color: "light"
            };
        return (
            <React.Fragment>
                {!!this.state.loading
                    ? <React.Fragment>...</React.Fragment>
                    : <div className="btn-group">
                        <button type="button" className="btn btn-light" onClick={() => {this.categorise(this.props.selectedCat)}}>
                            {v.name}
                        </button>
                        <button type="button" className="btn btn-light dropdown-toggle dropdown-toggle-split" data-toggle="dropdown">
                        <span className={`badge badge-dot badge-dot-lg badge-${v.color}`}> </span>
                        </button>
                        <div className="dropdown-menu">
                            {this.props.all.map((v, i) => {
                                return <a key={i} className="dropdown-item" onClick={() => {this.categorise(v.id)}}>{v.name}</a>
                            })}
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default DropDownDot;
