
const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createBin, getAllBins, getBin, updateBin, deleteBin, setBinEmptied
} = require('./bin.service');

// create bin
router.post('/', auth, createBin);

// get all bins
router.get('/', auth, getAllBins);

// get specific bin
router.get('/:id', auth, getBin);

// update bin
router.patch('/:id', updateBin);

// set bin emptied
router.post('/:id/emptied', auth, setBinEmptied);

// delete bin
router.delete('/:id', auth, deleteBin);

module.exports = router;
