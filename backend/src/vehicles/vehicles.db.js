const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'Vehicles'
};

async function getVehiclesFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getVehicleByID(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ VehicleID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching vehicle by ID:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function createVehicleInDB(vehicle) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateVehicleInDB(id, vehicleData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const { _id, ...dataToUpdate } = vehicleData;

        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ VehicleID: parseInt(id) }, { $set: dataToUpdate });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteVehicleFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ VehicleID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}
async function updateVehicleKmInDB(id, Km) {
    const mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne(
            { VehicleID: parseInt(id) },
            { $set: { Km: Km } }
        );
    } catch (error) {
        console.error('Error updating vehicle Km:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}
module.exports = {
    getVehiclesFromDB,
    getVehicleByID,
    createVehicleInDB,
    updateVehicleInDB,
    deleteVehicleFromDB,
    updateVehicleKmInDB 
};
