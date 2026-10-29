const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.js');
const notesRoutes = require('./routes/notes.js');
const tagsRoutes = require('./routes/tags.js');
const cors = require('cors');
app.use(cors())
app.use(express.json());
app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);
app.use('/tags',tagsRoutes);
app.listen(3000, () => { console.log("Running..."); });

