import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'dropzone';

import MTable from './MTable';

class CsvUploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSubmit: false
        }
        this.transactionsAdd = this.transactionsAdd.bind(this);
    }
    transactionsAdd() {
        event.preventDefault();
        this.setState((prevState, props) => {
            return {
                showSubmit: false
            }
        });
        $.ajax({
            type: 'POST',
            url: "/api.php",
            data: {r: "transactions", data: this.state.sendToApi},
            success: function(data) {
                if (data.status) {
                    location.reload();
                }
                else {
                    alert("API error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("API error");
                console.log("error", jqXHR, textStatus, errorThrown);
            }
        });
    }
    replaceBulk(str, findArray, replaceArray) {
        var i, regex = [], map = {};
        for(i=0; i<findArray.length; i++) {
            regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1'));
            map[findArray[i]] = replaceArray[i];
        }
        regex = regex.join('|');
        str = str.replace(new RegExp(regex, 'g'), (matched) => {
            return map[matched];
        });
        return str;
    }
    findArrayInArray(source, lookingFor) {
        var colsSeparator = ";;;";
        var rowsSeparator = "|||";
        source.map((el) => {return el.join(colsSeparator)}).join(rowsSeparator),
        lookingFor.map((el) => {return el.join(colsSeparator)}).join(rowsSeparator)
        var res = source.map((el) => {return el.join(colsSeparator)}).join(rowsSeparator).split(
            lookingFor.map((el) => {return el.join(colsSeparator)}).join(rowsSeparator)
        );
        var newestTransactions = res[0].split(rowsSeparator);
        newestTransactions.pop();
        return newestTransactions.map((el) => {return el.split(colsSeparator)});
    }
    componentDidMount() {
        var myDropzone = new Dropzone("#MyDropZone", {
            url: "/file/post",
            clickable: true,
            accept: (file, done) => {
                var reader = new FileReader();
                reader.readAsText(file, "ISO-8859-2");
                reader.addEventListener(
                    "loadend",
                    (event) => {
                        file.previewElement.parentNode.removeChild(file.previewElement);
                        var replaced = this.replaceBulk(
                            event.target.result,
                            ["š", "Ľ", "", ""],
                            ["ą", "Ą", "Ś", "Ś"]
                        );
                        var arr = replaced.split("\n");
                        var allNewTransactions = new Array();
                        arr.splice(0,2);
                        arr.pop();
                        arr.map((row) => {
                            var newArr = row.split(";");
                            allNewTransactions.push([newArr[0], newArr[5].toString().replace(".", ","), newArr[2], newArr[3], newArr[4]]);
                        })
                        this.props.paneData.rows.map((el) => {
                            el[2] = el[2].toString().replace(".", ",");
                            el.pop();
                            return el.shift();
                        });
                        this.props.paneData.rawData.map((el) => {
                            el[2] = el[2].toString().replace(".", ",");
                            el.pop();
                            return el.shift();
                        });
                        var forTable = this.findArrayInArray(
                            allNewTransactions,
                            this.props.paneData.rawData.slice(0, 3)
                        );
                        this.setState((prevState, props) => {
                            return {
                                sendToApi: forTable.slice().reverse(),
                                showSubmit: {
                                    class: "fade-out",
                                    title: false,
                                    headers: ["Data", "Kwota", "Nadawca", "Odbiorca", "Tytuł"],
                                    rows: forTable.concat(this.props.paneData.rows.slice(0, 3))
                                }
                            }
                        });
                    }
                );
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="col-md-6">
                    <div className="card-hover-shadow-2x mb-3 card">
                        <div className="card-header">Krok 1 / 2</div>
                        <div className="card-body" id="MyDropZone">
                            Upuść plik tutaj lub kliknij
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-hover-shadow-2x mb-3 card">
                        <div className="card-header">Krok 2 / 2</div>
                        {this.state.showSubmit && <React.Fragment>
                            <MTable tableData={this.state.showSubmit} />
                            <div className="d-block text-right card-footer">
                                <button className="btn-shadow-primary btn btn-primary btn-lg" onClick={this.transactionsAdd}>Dodaj transakcje</button>
                            </div>
                        </React.Fragment>}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default CsvUploadComponent;
