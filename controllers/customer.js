exports.getCustomers = (req, res, next) => {
   console.log(req);
   console.log(res);
   return res.status(200).json();
}