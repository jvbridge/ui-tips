const diagnostics = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// GET Route for retrieving diagnostic information
diagnostics.get('/', (req, res) => {
    readFromFile('./db/diagnostics.json').then((data) => {
      res.json(JSON.parse(data));
    });
});

// POST Route for a error logging
diagnostics.post('/', (req, res) => {
  const {isValid, errors} = req.body;

  // If the body is present
  if (typeof isValid == 'boolean' && errors){
    // make a new object to append
    const newDiagnostic = {
      time: Date.now(),
      errors,
      error_id: uuidv4()
    };
    // send it in
    readAndAppend(newDiagnostic, './db/diagnostics');
    const response = {
      status: 'success',
      body: newDiagnostic
    };
  
    res.json(response);

  } else {
    res.json({
      message:"object is valid"
    });
  }
});

module.exports = diagnostics;
