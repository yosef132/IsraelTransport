const { 
    getBookingTypesFromDB, 
    getBookingTypeByID, 
    createBookingTypeInDB, 
    updateBookingTypeInDB, 
    deleteBookingTypeFromDB 
} = require('./BookingTypes.db');
const { getNextSequenceValue } = require('../Counters/CounterService');
const BookingType = require('./BookingTypes.Model');

async function getBookingTypes(req, res) {
    try {
        const bookingTypes = await getBookingTypesFromDB();
        res.status(200).send(bookingTypes);
    } catch (error) {
        console.error('Error fetching booking types:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getBookingType(req, res) {
    const { id } = req.params;
    try {
        const bookingType = await getBookingTypeByID(id);
        if (bookingType) {
            res.status(200).send(bookingType);
        } else {
            res.status(404).send({ error: 'Booking type not found' });
        }
    } catch (error) {
        console.error('Error fetching booking type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}


async function createBookingType(req, res) {
    const { TypeName } = req.body;

    if (!TypeName) {
        return res.status(400).send({ error: 'TypeName is required' });
    }

    try {
        const bookingTypeID = await getNextSequenceValue('BookingTypes');

        const bookingTypeData = {
            BookingTypeID: bookingTypeID,
            TypeName
        };

        const newBookingType = await createBookingTypeInDB(bookingTypeData);

        res.status(201).send({
            message: 'Booking type created successfully',
            newBookingType
        });
    } catch (error) {
        console.error('Error creating booking type:', error.message);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}



async function updateBookingType(req, res) {
    const { id } = req.params;
    const bookingTypeData = req.body;
    try {
        console.log(`Updating booking type with BookingTypeID: ${id}`);
        const result = await updateBookingTypeInDB(id, bookingTypeData);
        if (result.modifiedCount > 0) {
            console.log(`Booking type with ID ${id} updated successfully`);
            res.status(200).send({ message: 'Booking type updated successfully' });
        } else {
            console.log(`Booking type with ID ${id} not found`);
            res.status(404).send({ error: 'Booking type not found' });
        }
    } catch (error) {
        console.error('Error updating booking type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}



async function deleteBookingType(req, res) {
    const { id } = req.params;
    try {
        console.log(`Deleting booking type with BookingTypeID: ${id}`);
        const result = await deleteBookingTypeFromDB(id);
        if (result.deletedCount > 0) {
            console.log(`Booking type with ID ${id} deleted successfully`);
            res.status(200).send({ message: 'Booking type deleted successfully' });
        } else {
            console.log(`Booking type with ID ${id} not found`);
            res.status(404).send({ error: 'Booking type not found' });
        }
    } catch (error) {
        console.error('Error deleting booking type:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}


module.exports = { getBookingTypes, getBookingType, createBookingType, updateBookingType, deleteBookingType };
