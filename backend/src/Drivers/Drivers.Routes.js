const express = require('express');
const { getDrivers, getDriverByID, getDriverNameByID,checkDriverCredentials, getDriverIDByName, createDriver, updateDriver, deleteDriver } = require('./Drivers.Controller');
const router = express.Router();

router.get('/GetAllDrivers', getDrivers);
router.post('/CreateDriver', createDriver);
router.get('/GetDriver/:id', getDriverByID);
router.put('/UpdateDriver/:id', updateDriver);
router.delete('/DeleteDriver/:id', deleteDriver);
router.get('/GetDriverIDByName/:name', getDriverIDByName);
router.post('/Login', checkDriverCredentials);
router.get('/GetDriverNameByID/:id', getDriverNameByID);
module.exports = router;
