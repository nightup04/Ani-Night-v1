const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.cookies['login-token'];

    if (!token) {
        req.session.returnTo = req.originalUrl;
        req.alertMessage = 'กรุณาเข้าสู่ระบบ';
        return res.redirect('/login');
    } 

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            req.session.returnTo = req.originalUrl;
            req.alertMessage = 'การยืนยันตัวตนล้มเหลว';
            return res.redirect('/login');
        }
        req.userId = decoded.userId;
        console.log(req.userId)
        next();
    });
}

function verifyTokenAdmin(req, res, next) {
    const accessToken = req.cookies['login-token']; 

    if (!accessToken) {
        req.session.returnTo = req.originalUrl;
        req.alertMessage = 'กรุณาเข้าสู่ระบบ';
        return res.redirect('/login');
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            req.session.returnTo = req.originalUrl;
            req.alertMessage = 'การยืนยันตัวตนล้มเหลว';
            return res.redirect('/login');
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = { verifyToken, verifyTokenAdmin };

// if (!accessToken) {
//     req.session.returnTo = req.originalUrl;
//     req.alertMessage = 'กรุณาเข้าสู่ระบบ';
//     return res.status(401).render('login', { alertMessage: req.alertMessage });
// } 