const pool = require('../config/database');
const logger = require('../config/logger');

const getDataController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM sustainability_data');
        const totalRecords = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalRecords / limit);

        const result = await pool.query(
            'SELECT * FROM sustainability_data ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json({
            status: 'success',
            data: result.rows,
            pagination: {
                page,
                limit,
                totalRecords,
                totalPages
            }
        });
    } catch (error) {
        logger.error('Error in getDataController:', error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};

const getDataByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM sustainability_data WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (error) {
        logger.error('Error in getDataByIdController:', error);
        res.status(500).json({ error: 'Failed to retrieve record' });
    }
};

module.exports = {
    getDataController,
    getDataByIdController
}; 