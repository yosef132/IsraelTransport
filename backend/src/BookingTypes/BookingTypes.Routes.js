const express = require('express');
const { getBookingTypes, createBookingType, getBookingType, updateBookingType, deleteBookingType } = require('./BookingTypes.Controller');
const router = express.Router();

router.get('/GetAllBookingTypes', getBookingTypes);
router.post('/CreateBookingType', createBookingType);
router.get('/GetBookingType/:id', getBookingType);
router.put('/UpdateBookingType/:id', updateBookingType);
router.delete('/DeleteBookingType/:id', deleteBookingType);

module.exports = router;
