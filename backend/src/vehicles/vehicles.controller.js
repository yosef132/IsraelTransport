const { 
    getVehiclesFromDB, 
    getVehicleByID, 
    createVehicleInDB, 
    updateVehicleInDB, 
    deleteVehicleFromDB,
    updateVehicleKmInDB
} = require('./vehicles.db');
const Vehicle = require('./vehicles.model');
const { getNextSequenceValue } = require('../Counters/CounterService');
const { sendEmail } = require('../EmailVerifying/email'); 



async function getVehicles(req, res) {
    try {
        const vehicles = await getVehiclesFromDB();
        res.status(200).send(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getVehicle(req, res) {
    const { id } = req.params;
    try {
        const vehicle = await getVehicleByID(id);
        if (vehicle) {
            res.status(200).send(vehicle);
        } else {
            res.status(404).send({ error: 'Vehicle not found' });
        }
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function createVehicle(req, res) {
    const { Make, Model, Year, Km, vehicleType, carPlateNumber } = req.body;
    if (!Make || !Model || !Year || !Km || !vehicleType || !carPlateNumber) {
        return res.status(400).send({ error: 'All vehicle details are required' });
    }

    try {
        const VehicleID = await getNextSequenceValue('Vehicles'); 
        const newVehicle = new Vehicle({ VehicleID, Make, Model, Year, Km, vehicleType, carPlateNumber });
        await createVehicleInDB(newVehicle);
        res.status(201).send({ message: 'Vehicle created successfully' });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}


async function updateVehicle(req, res) {
    const { id } = req.params;
    const vehicleData = req.body;

    try {
        const result = await updateVehicleInDB(id, vehicleData);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Vehicle updated successfully' });
        } else {
            res.status(404).send({ error: 'Vehicle not found' });
        }
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function deleteVehicle(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteVehicleFromDB(id);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Vehicle deleted successfully' });
        } else {
            res.status(404).send({ error: 'Vehicle not found' });
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function updateVehicleKm(req, res) {
    const { id } = req.params;
    const { Km } = req.body;

    if (Km == null) {
        return res.status(400).send({ error: 'Km value is required' });
    }

    try {
        // Retrieve the vehicle to check current Km and last maintenance milestone
        const vehicle = await getVehicleByID(id);
        if (!vehicle) {
            return res.status(404).send({ error: 'Vehicle not found' });
        }

        // Calculate the next maintenance milestone (every 10,000 km)
        const nextMaintenanceMilestone = Math.floor(Km / 10000) * 10000;
        const isNewMilestone = nextMaintenanceMilestone > (vehicle.lastMaintenanceKm || 0) && Km >= nextMaintenanceMilestone;

        // Update the Km and, if a new milestone is reached, update lastMaintenanceKm
        const updateData = { Km };
        if (isNewMilestone) {
            updateData.lastMaintenanceKm = nextMaintenanceMilestone;
        }

        // Update the vehicle in the database
        const result = await updateVehicleKmInDB(id, updateData);
        if (result.modifiedCount > 0) {
            // If new maintenance milestone, send an email notification
            if (isNewMilestone) {
                await notifyMaintenance(vehicle, Km);
            }
            res.status(200).send({ message: 'Vehicle Km updated successfully' });
        } else {
            res.status(404).send({ error: 'Vehicle not found or Km not updated' });
        }
    } catch (error) {
        console.error('Error updating vehicle Km:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function notifyMaintenance(vehicle, Km) {
    const subject = `Vehicle Maintenance Alert for ${vehicle.Make} ${vehicle.Model}`;
    const htmlContent = `
        <p>The vehicle with plate number <strong>${vehicle.carPlateNumber}</strong> has reached a maintenance milestone.</p>
        <p><strong>Current Km:</strong> ${Km} km</p>
        <p>This vehicle requires maintenance at every 10,000 km milestone.</p>
    `;
    const adminEmail = process.env.ADMIN_EMAIL || 'chatgptuser885@gmail.com';

    try {
        await sendEmail(adminEmail, subject, htmlContent);
        console.log(`Maintenance email sent for vehicle with ID ${vehicle.VehicleID}`);
    } catch (error) {
        console.error('Error sending maintenance email:', error);
    }
}


module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, updateVehicleKm , deleteVehicle };
