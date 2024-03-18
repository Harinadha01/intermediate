import React, { useState } from 'react';
import axios from 'axios';

const Editor = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');

    const executeCode = async () => {
        try {
            const response = await axios.post('/execute', { code, language });
            setOutput(response.data.output);
        } catch (error) {
            console.error('Error executing code:', error);
        }
    };

    return (
        <div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                {/* Add more language options */}
            </select>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={executeCode}>Run Code</button>
            <div>
                <h3>Output:</h3>
                <pre>{output}</pre>
            </div>
        </div>
    );
};
const express = require('express');
const { executeCode } = require('./codeExecutor'); // Assume this function executes the code

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint for executing code
app.post('/execute', async (req, res) => {
    const { code, language } = req.body;
    try {
        const output = await executeCode(code, language);
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: 'Error executing code' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

