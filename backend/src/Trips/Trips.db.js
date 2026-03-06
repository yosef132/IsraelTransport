const { MongoClient, ObjectId } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'Trips'
};

async function getTripsFromDB() {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find().toArray();
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getTripByIDFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ TripID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching trip by ID:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getTripsByTypeFromDB(TripType) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find({
            TripType: { $regex: TripType, $options: 'i' } // Case-insensitive partial match
        }).toArray();
    } catch (error) {
        console.error('Error fetching trips by type from DB:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}



async function createTripInDB(tripData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const result = await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(tripData);
        console.log('Trip created:', result);
        return result.insertedId; 
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getTripIDByNameFromDB(name) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ TripName: name });
    } catch (error) {
        console.error('Error fetching trip by name:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateTripInDB(id, tripData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne(
            { TripID: parseInt(id) },
            { $set: tripData }
        );
    } catch (error) {
        console.error('Error updating trip:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteTripFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ TripID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}
async function deleteAllTripsFromDB() {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteMany({});
    } catch (error) {
        console.error('Error deleting all trips:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}
module.exports = {
    getTripsFromDB,
    getTripByIDFromDB,
    createTripInDB,
    updateTripInDB,
    deleteTripFromDB,
    getTripIDByNameFromDB,
    deleteAllTripsFromDB,
    getTripsByTypeFromDB
};
