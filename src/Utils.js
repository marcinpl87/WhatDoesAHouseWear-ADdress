class Utils {
    findArrValById(arr, id, column=1) {
        var resultArr = (arr.filter((value) => {
            return value[0]==id;
        }))[0];
        return resultArr ? resultArr[column] : 0;
    }
}

export default new Utils();
