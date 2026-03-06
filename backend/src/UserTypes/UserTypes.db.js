const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'UserTypes'
};

async function getUserTypesFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error fetching user types:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function createUserTypeInDB(userType) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(userType);
    } catch (error) {
        console.error('Error creating user type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateUserTypeInDB(id, userTypeData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ userTypeID: parseInt(id) }, { $set: userTypeData });
    } catch (error) {
        console.error('Error updating user type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteUserTypeFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ userTypeID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting user type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

module.exports = {
    getUserTypesFromDB,
    createUserTypeInDB,
    updateUserTypeInDB,
    deleteUserTypeFromDB
};
