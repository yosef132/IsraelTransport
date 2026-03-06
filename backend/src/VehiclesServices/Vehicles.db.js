const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'VehicleServices'
};

async function getVehicleServicesFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error fetching vehicle services:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getVehicleServiceByID(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ ServiceID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching vehicle service:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function createVehicleServiceInDB(service) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(service);
    } catch (error) {
        console.error('Error creating vehicle service:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateVehicleServiceInDB(id, serviceData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ ServiceID: parseInt(id) }, { $set: serviceData });
    } catch (error) {
        console.error('Error updating vehicle service:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteVehicleServiceFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ ServiceID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting vehicle service:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

module.exports = {
    getVehicleServicesFromDB,
    getVehicleServiceByID,
    createVehicleServiceInDB,
    updateVehicleServiceInDB,
    deleteVehicleServiceFromDB
};
