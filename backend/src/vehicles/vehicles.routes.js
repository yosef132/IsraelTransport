const express = require('express');
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle, updateVehicleKm } = require('./vehicles.controller');
const router = express.Router();

router.get('/GetAllVehicles', getVehicles);
router.get('/GetVehicle/:id', getVehicle);
router.post('/CreateVehicle', createVehicle);
router.put('/UpdateVehicle/:id', updateVehicle);
router.put('/UpdateVehicleKm/:id', updateVehicleKm);  
router.delete('/DeleteVehicle/:id', deleteVehicle);

module.exports = router;
