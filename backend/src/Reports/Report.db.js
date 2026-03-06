const { MongoClient } = require('mongodb');

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'Reports'
};

async function getReportsFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getReportByIDFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ ReportID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function createReportInDB(reportData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(reportData);
    } catch (error) {
        console.error('Error creating report:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function deleteReportFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ ReportID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateReportInDB(id, updateData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne({ ReportID: parseInt(id) }, { $set: updateData });
    } catch (error) {
        console.error('Error updating report:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

module.exports = {
    getReportsFromDB,
    createReportInDB,
    deleteReportFromDB,
    updateReportInDB,
    getReportByIDFromDB
};
