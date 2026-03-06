const { getVehicleServicesFromDB, getVehicleServiceByID, createVehicleServiceInDB, updateVehicleServiceInDB, deleteVehicleServiceFromDB } = require('./Vehicles.db');
const VehicleService = require('./Vehicles.Model');
const Vehicle = require('../vehicles/vehicles.model');
const { getNextSequenceValue } = require('../Counters/CounterService');



async function getVehicleServices(req, res) {
    try {
        const services = await getVehicleServicesFromDB();
        res.status(200).send(services);
    } catch (error) {
        console.error('Error fetching vehicle services:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getVehicleService(req, res) {
    const { id } = req.params;
    try {
        const service = await getVehicleServiceByID(id);
        if (service) {
            res.status(200).send(service);
        } else {
            res.status(404).send({ error: 'Vehicle service not found' });
        }
    } catch (error) {
        console.error('Error fetching vehicle service:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function createVehicleService(req, res) {
    const { VehicleID, serviceType, serviceDate, km } = req.body; 
    if (!VehicleID || !serviceType || !serviceDate || !km) {
        return res.status(400).send({ error: 'All service details are required' });
    }
    try {
        const ServiceID = await getNextSequenceValue('VehicleServices'); 
        const newService = new VehicleService({ ServiceID, VehicleID, serviceType, serviceDate, km });
        await createVehicleServiceInDB(newService);
        res.status(201).send({ message: 'Vehicle service created successfully' });
    } catch (error) {
        console.error('Error creating vehicle service:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function updateVehicleService(req, res) {
    const { id } = req.params;
    const serviceData = req.body;

    try {
        const result = await updateVehicleServiceInDB(id, serviceData);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Vehicle service updated successfully' });
        } else {
            res.status(404).send({ error: 'Vehicle service not found' });
        }
    } catch (error) {
        console.error('Error updating vehicle service:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function deleteVehicleService(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteVehicleServiceFromDB(id);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Vehicle service deleted successfully' });
        } else {
            res.status(404).send({ error: 'Vehicle service not found' });
        }
    } catch (error) {
        console.error('Error deleting vehicle service:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { getVehicleServices, getVehicleService, createVehicleService, updateVehicleService, deleteVehicleService };
