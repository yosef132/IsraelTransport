const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'BookingTypes'
};

async function getBookingTypesFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const bookingTypes = await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
        console.log('Booking Types:', bookingTypes); 
        return bookingTypes;
    } catch (error) {
        console.error('Error fetching booking types:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function getBookingTypeByID(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ BookingTypeID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching booking type by ID:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function createBookingTypeInDB(bookingTypeData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(bookingTypeData);
    } catch (error) {
        console.error('Error creating booking type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function updateBookingTypeInDB(id, bookingTypeData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const result = await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ BookingTypeID: parseInt(id) }, { $set: bookingTypeData });
        return result;
    } catch (error) {
        console.error('Error updating booking type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function deleteBookingTypeFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        console.log(`Searching for BookingTypeID: ${id}`);
        const result = await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ BookingTypeID: parseInt(id) });
        console.log(`Delete result: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        console.error('Error deleting booking type:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}



module.exports = {
    getBookingTypesFromDB,
    getBookingTypeByID,
    createBookingTypeInDB,
    updateBookingTypeInDB,
    deleteBookingTypeFromDB
};
