const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const logger = require('../config/logger');
const pool = require('../config/database');
const Queue = require('bull');
const { addData } = require('./dataController');

// Create a Bull queue for processing CSV files
const processQueue = new Queue('csvProcessing');

const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const results = [];
        const parser = parse({
            columns: true,
            skip_empty_lines: true
        });

        parser.on('readable', function() {
            let record;
            while (record = parser.read()) {
                results.push(record);
            }
        });

        parser.on('error', function(err) {
            console.error('Error parsing CSV:', err);
            res.status(500).json({ error: 'Error processing file' });
        });

        parser.on('end', function() {
            // Add parsed data to in-memory storage
            addData(results);
            
            // Clean up the uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });

            res.json({
                message: 'File processed successfully',
                recordsProcessed: results.length
            });
        });

        // Read the file and pipe it to the parser
        fs.createReadStream(req.file.path).pipe(parser);
    } catch (error) {
        console.error('Error in file upload:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

const previewController = async (req, res) => {
    try {
        const filePath = path.join(process.env.UPLOAD_DIR || './uploads', req.params.filename);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        
        const records = [];
        const parser = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        for await (const record of parser) {
            records.push(record);
            if (records.length >= 10) break;
        }

        res.json({
            status: 'success',
            preview: records
        });
    } catch (error) {
        logger.error('Error in file preview:', error);
        res.status(500).json({ error: 'Failed to preview file' });
    }
};

const processController = async (req, res) => {
    try {
        const { filename, mapping } = req.body;
        const filePath = path.join(process.env.UPLOAD_DIR || './uploads', filename);

        // Save mapping configuration
        const mappingResult = await pool.query(
            'INSERT INTO column_mappings (name, mapping_config) VALUES ($1, $2) RETURNING id',
            [filename, mapping]
        );

        // Add job to queue
        await processQueue.add({
            filePath,
            mapping,
            mappingId: mappingResult.rows[0].id
        });

        res.json({
            status: 'success',
            message: 'File processing started',
            mappingId: mappingResult.rows[0].id
        });
    } catch (error) {
        logger.error('Error in process controller:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
};

// Process queue worker
processQueue.process(async (job) => {
    const { filePath, mapping, mappingId } = job.data;
    
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const records = [];
        
        const parser = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        for await (const record of parser) {
            const mappedRecord = {};
            for (const [csvColumn, dbColumn] of Object.entries(mapping)) {
                mappedRecord[dbColumn] = record[csvColumn];
            }
            
            await pool.query(
                `INSERT INTO sustainability_data 
                (date, emission_kg, energy_consumption_kwh, water_usage_liters, 
                waste_kg, renewable_energy_percentage, notes, source_file) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    mappedRecord.date || null,
                    mappedRecord.emission_kg || null,
                    mappedRecord.energy_consumption_kwh || null,
                    mappedRecord.water_usage_liters || null,
                    mappedRecord.waste_kg || null,
                    mappedRecord.renewable_energy_percentage || null,
                    mappedRecord.notes || null,
                    filename
                ]
            );
        }

        return { status: 'success', recordsProcessed: records.length };
    } catch (error) {
        logger.error('Error in queue processing:', error);
        throw error;
    }
});

module.exports = {
    handleFileUpload,
    processController,
    previewController
}; 