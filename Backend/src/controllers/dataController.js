// In-memory storage for data
let inMemoryData = [];

const getDataController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedData = inMemoryData.slice(startIndex, endIndex);
        
        res.json({
            data: paginatedData,
            total: inMemoryData.length,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
};

const getDataByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = inMemoryData[id];
        
        if (!item) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
};

const addData = (data) => {
    inMemoryData = inMemoryData.concat(data);
};

module.exports = {
    getDataController,
    getDataByIdController,
    addData
}; 