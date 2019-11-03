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
    sumTax(transactions) {
        var sum = 0;
        var sumArr = [];
        transactions.map((el) => {
            if (el.category_id == 5) {
                sumArr.push(this.mRound(el.value));
                sum = this.mRound(sum) + this.mRound(el.value);
            }
        });
        return [this.mRound(sum), sumArr];
    }
}

export default new Utils();
