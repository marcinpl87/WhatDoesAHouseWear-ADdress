import React from 'react';
import ReactDOM from 'react-dom';
import LongText from './LongText';
import BadgeButton from './BadgeButton';

class Fin {
    prepareData(data) {
        var flatArr = data.transactions.map(x => Object.values(x));
        var flatRules = data.rules.map(x => Object.values(x));
        flatArr.map((el) => {
            el[5] = <LongText text={el[5]} />;
            el[6] = <BadgeButton
                cat={el[6]}
                allCat={data.categories}
                transactionData={el}
                rulesData={flatRules}
            />;
        });
        return flatArr;
    }
    prepareRawData(data) {
        var flatArr = data.map(x => Object.values(x));
        flatArr.map((el) => {
            el[2] = parseFloat(el[2]).toFixed(2);
        });
        return flatArr;
    }
    createTableStructure(data) {
        return {
            data: data,
            title: false,
            headers: ["Id", "Data", "Kwota", "Nadawca", "Odbiorca", "Tytuł", "Kategoria_Transakcji____"],
            rawData: this.prepareRawData(JSON.parse(JSON.stringify(data)).transactions), //clone
            rows: this.prepareData(data)
        };
    }
}

class Utils {
    findArrValById(arr, id, column = 1) {
        var resultArr = (arr.filter((value) => {
            return value[0]==id;
        }))[0];
        return resultArr ? resultArr[column] : 0;
    }
    replaceAll(str, find, replace) {
        return String(str).replace(
            new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'),
            replace
        );
    }
    mRound(num, position = 2) {
        return Number(parseFloat(num).toFixed(position));
    }
    sumTax(transactions, cat = 5) {
        var sum = 0;
        var sumArr = [];
        var dateArr = [];
        transactions.map((el) => {
            if (el.category_id == cat) {
                sumArr.push(this.mRound(el.value));
                sum = this.mRound(sum) + this.mRound(el.value);
                dateArr.push(el.date_transaction);
            }
        });
        return [this.mRound(sum), sumArr, dateArr];
    }
    expiredSessionHandler() {
        console.log("User session error");
        setTimeout(() => {
            location.reload();
        }, 5000);
    }
    ajax(method, url, data) {
        return $.ajax({
            method: method,
            url: "/wp-json/mapi/" + url,
            dataType: "json",
            data: data,
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "x-wp-nonce",
                    $(".app-container").data("nonce")
                );
            }
        }).done((data) => {
            if (data.session !== "1") {
                this.expiredSessionHandler();
            }
        }).fail(() => {
            this.expiredSessionHandler();
        });
    }
    objPick(obj, props) {
        return props.reduce((a, e) => (a[e] = obj[e], a), {});
    }
    fin() {
        return new Fin();
    }
}

export default new Utils();
