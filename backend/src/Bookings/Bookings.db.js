const { MongoClient } = require('mongodb');
const { DateTime } = require('luxon'); // Use luxon for timezone handling

const DB_INFO = {
    uri: process.env.CONNECTION_STRING,
    name: process.env.DB_NAME,
    collection: 'Bookings'
};

async function getBookingsFromDB(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function getUpcomingBookingsWithinOneDay() {
    const now = new Date();
    const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));

    const startOfTomorrow = new Date(israelTime);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0); // Set to 00:00:00

    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999); // Set to 23:59:59

    console.log(`Start of tomorrow (Israel time): ${startOfTomorrow}`);
    console.log(`End of tomorrow (Israel time): ${endOfTomorrow}`);

    const query = {
        startTrailDate: {
            $gte: startOfTomorrow, // Greater than or equal to 00:00:00
            $lte: endOfTomorrow // Less than or equal to 23:59:59
        },
        status: 'Confirmed' // Only confirmed bookings
    };

    try {
        const upcomingBookings = await getBookingsFromDB(query);
        console.log(`Upcoming bookings: ${JSON.stringify(upcomingBookings)}`);
        return upcomingBookings;
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        throw error;
    }
}




async function getBookingByIDInDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).findOne({ BookingID: parseInt(id) });
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function createBookingInDB(bookingData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        await mongo.db(DB_INFO.name).collection(DB_INFO.collection).insertOne(bookingData);
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

async function updateBookingInDB(id, bookingData) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).updateOne(
            { BookingID: parseInt(id) },
            { $set: bookingData }
        );
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}


async function deleteBookingFromDB(id) {
    let mongo = new MongoClient(DB_INFO.uri);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.name).collection(DB_INFO.collection).deleteOne({ BookingID: parseInt(id) });
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    } finally {
        await mongo.close();
    }
}

module.exports = {
    getBookingsFromDB,
    getBookingByIDInDB,
    createBookingInDB,
    updateBookingInDB,
    deleteBookingFromDB,
    getUpcomingBookingsWithinOneDay
};
