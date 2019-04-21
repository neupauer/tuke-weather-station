import _ from "lodash";

const random = () => _.random(0, 100, false);

const average = arr => _.sum(arr) / arr.length;

const movement = (arr) => {
    if(!arr || !Array.isArray(arr) || arr.length < 6) {
        return 0;
    }

    const last =  _.last(arr);
    const sliced = _.slice(arr, arr.length - 6, arr.length - 1)
    const avg = average(sliced);

    return _.round(((last * 100) / avg) - 100, 1);
};

const last = (arr) => {
    if(!arr || !Array.isArray(arr) || arr.length <= 0) {
        return NaN;
    }

    return _.last(arr);
};

export {
    average,
    movement,
    last,
    random,
}