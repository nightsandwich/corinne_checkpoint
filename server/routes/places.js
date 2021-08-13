const router = require('express').Router();
const app = require('../app');
const {
  models: { Place },
} = require('../db');

// Add your routes here:
//
router.get('/unassigned', async(req, res, next) => {
  try {
    res.send(await Place.findCitiesWithNoParent());
  }
  catch(err){
    next(err);
  }
});

router.get('/states', async(req, res, next) => {
  try {
    res.send (await Place.findStatesWithCities());
  }
  catch(err){
    next(err);
  }
}); 

router.delete('/:id', async(req, res, next) => {
  const {id} = req.params;
  await Place.destroy(id);
  res.sendStatus(404);
});

module.exports = router;
