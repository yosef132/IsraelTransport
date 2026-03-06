const Counter = require('./Counter.Model');

async function getNextSequenceValue(collectionName) {
    try {
        const result = await Counter.findOneAndUpdate(
            { _id: collectionName },
            { $inc: { count: 1 } },
            { new: true, upsert: true } 
        );

        if (!result) {
            throw new Error(`No Counter found for collection ${collectionName}`);
        }

        return result.count;  
    } catch (error) {
        console.error(`Error getting next sequence value for ${collectionName}:`, error);
        throw error;
    }
}

module.exports = { getNextSequenceValue };
