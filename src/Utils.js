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
}

export default new Utils();
