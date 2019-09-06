class Utils {
    findArrValById(arr, id) {
        var resultArr = (arr.filter((value) => {
            return value[0]==id;
        }))[0];
        return resultArr ? resultArr[1] : 0;
    }
}

export default new Utils();
