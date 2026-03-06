const express = require('express');
const { createSchedule, getSchedules,getScheduleByDriverID, getScheduleByID, updateSchedule, deleteSchedule } = require('./Schedule.Controller');
const router = express.Router();

router.post('/CreateSchedule', createSchedule);
router.get('/GetAllSchedules', getSchedules);
router.get('/GetScheduleByID/:id', getScheduleByID);
router.put('/UpdateSchedule/:id', updateSchedule);
router.delete('/DeleteSchedule/:id', deleteSchedule);
router.get('/GetScheduleByDriverID/:driverID', getScheduleByDriverID);  // Updated route

module.exports = router;
