const express = require('express');
const { getBookings, getBookingByID, createBooking, updateBooking, deleteBooking } = require('./Bookings.Controller');
const router = express.Router();

router.get('/', getBookings);
router.get('/:id',getBookingByID);
router.post('/create', createBooking);
router.put('/update/:id', updateBooking);
router.delete('/delete/:id', deleteBooking);

module.exports = router;
