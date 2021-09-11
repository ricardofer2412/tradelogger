module.exports = (req, res, next) =>{
    const url = req.url;
    next();
};