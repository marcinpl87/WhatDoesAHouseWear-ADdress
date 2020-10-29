class Utils {
    findArrValById(arr, id, column=1) {
        var resultArr = (arr.filter((value) => {
            return value[0]==id;
        }))[0];
        return resultArr ? resultArr[column] : 0;
    }
    replaceAll(str, find, replace) {
        return str.replace(
            new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'),
            replace
        );
    }
    mRound(num, position = 2) {
        return Number(parseFloat(num).toFixed(position));
    }
    sumTax(transactions, cat=5) {
        var sum = 0;
        var sumArr = [];
        transactions.map((el) => {
            if (el.category_id == cat) {
                sumArr.push(this.mRound(el.value));
                sum = this.mRound(sum) + this.mRound(el.value);
            }
        });
        return [this.mRound(sum), sumArr];
    }
    expiredSessionHandler() {
        console.log("User session error");
        setTimeout(() => {
            location.reload();
        }, 5000);
    }
    ajax(method, url) {
        return $.ajax({
            method: method,
            url: "/wp-json/mapi/" + url,
            dataType: "json",
            beforeSend: (xhr) => {
                xhr.setRequestHeader(
                    "X-WP-Nonce",
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
}

export default new Utils();
