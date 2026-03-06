const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'Users'
};
async function getUserByIDInDB(userID) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const database = mongo.db(DB_INFO.name);
        const users = database.collection(DB_INFO.collection);
        const user = await users.findOne({ userID: parseInt(userID) }); 
        return user;
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}
async function getUsersFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, {projection}).toArray();
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getUserByUsername(username) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const database = mongo.db(DB_INFO.name);
        const users = database.collection(DB_INFO.collection);
        const user = await users.findOne({ username });
        return user;
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

async function createUserInDB(user) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const database = mongo.db(DB_INFO.name);
        const users = database.collection(DB_INFO.collection);
        await users.insertOne(user);
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteUserFromDB(userID) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ userID: parseInt(userID) });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}
async function updateUserInDB(userID, updatedUser) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ userID: parseInt(userID) }, { $set: updatedUser });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}
async function getUserByEmail(email) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        const database = mongo.db(DB_INFO.name);
        const users = database.collection(DB_INFO.collection);
        const user = await users.findOne({ email });
        return user;
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}


async function updateUserEmailInDB(userID, email) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ userID: parseInt(userID) }, { $set: { email: email } });
    } catch (error) {
        throw error;
    } finally {
        await mongo.close();
    }
}

module.exports = {
    getUsersFromDB,
    getUserByUsername,
    createUserInDB,
    getUserByIDInDB,
    deleteUserFromDB,
    updateUserInDB,
    updateUserEmailInDB,
    getUserByEmail
};
