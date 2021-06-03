exports.asyncError = (err, next, errCode) => {
    // console.log('err', err)
        const error = new Error(err);
        error.statusCode = errCode || 500;
        next(error);
}

// exports.syncError = (err, errCode, next) => {
//     // console.log('err', err)
//     const error = new Error(err);
//     error.statusCode = errCode || 500;
//     throw error;
// }