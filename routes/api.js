const express = require('express');
const router = express.Router();

const {createPdf,getFile,setEmail} = require('../controllers/api');

// Routes
router.post('/createpdf', createPdf);
router.get('/getpdf', getFile);
router.post("/setemail",setEmail)

module.exports = router;