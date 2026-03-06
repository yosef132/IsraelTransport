const express = require('express');
const { getTrips, getTrip, createTrip, deleteAllTrips , GetTripByType ,getTripIDByName, updateTrip, deleteTrip } = require('./Trips.Controller');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.get('/GetAllTrips', getTrips);
router.get('/GetTrip/:id', getTrip);
router.get('/GetTripIDByName/:name', getTripIDByName); 
router.get('/GetTripByType/:TripType', GetTripByType)
router.put('/UpdateTrip/:id', updateTrip);
router.delete('/DeleteTrip/:id', deleteTrip);
router.delete('/DeleteAllTrips', deleteAllTrips );  
router.post('/CreateTrip', upload.single('image'), createTrip);

module.exports = router;
