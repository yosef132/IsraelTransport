const express = require('express');
const { getVehicleServices, getVehicleService, createVehicleService, updateVehicleService, deleteVehicleService } = require('./Vehicles.Controller');
const router = express.Router();

router.get('/GetAllVehicleServices', getVehicleServices);
router.get('/GetVehicleService/:id', getVehicleService);
router.post('/CreateVehicleService', createVehicleService);
router.put('/UpdateVehicleService/:id', updateVehicleService);
router.delete('/DeleteVehicleService/:id', deleteVehicleService);

module.exports = router;
