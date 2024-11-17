module.exports = {
    range: function (start, end) {
        let result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    },
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    getImage: (images, index) => {
        return images && images[index] ? images[index] : '';
    }
};
