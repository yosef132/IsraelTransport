const { getReportsFromDB, createReportInDB, deleteReportFromDB, updateReportInDB, getReportByIDFromDB } = require('./Report.db');
const Report = require('./Report.Model');
const { getNextSequenceValue } = require('../Counters/CounterService');

async function getReports(req, res) {
    try {
        const reports = await getReportsFromDB();
        res.status(200).send(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function getReportByID(req, res) {
    const { id } = req.params;

    try {
        const report = await getReportByIDFromDB(id);
        if (!report) {
            return res.status(404).send({ error: 'Report not found' });
        }
        res.status(200).send(report);
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
}

async function createReport(req, res) {
    const { UserID, Message } = req.body;

    if (!UserID || !Message) {
        return res.status(400).send({ error: 'UserID and Message are required' });
    }

    try {
        const reportID = await getNextSequenceValue('Reports');
        const newReport = new Report({
            ReportID: reportID,
            UserID,
            Message,
            Status: 'Pending' 
        });
        await createReportInDB(newReport);
        res.status(201).send({ message: 'Report created successfully' });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function deleteReport(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteReportFromDB(id);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Report deleted successfully' });
        } else {
            res.status(404).send({ error: 'Report not found' });
        }
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

async function updateReport(req, res) {
    const { id } = req.params;
    const { Status } = req.body;

    if (!['Pending', 'Reviewed', 'Resolved'].includes(Status)) {
        return res.status(400).send({ error: 'Invalid status value' });
    }

    try {
        const result = await updateReportInDB(id, { Status });
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Report status updated successfully' });
        } else {
            res.status(404).send({ error: 'Report not found' });
        }
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

module.exports = { getReports, getReportByID, createReport, deleteReport, updateReport };
