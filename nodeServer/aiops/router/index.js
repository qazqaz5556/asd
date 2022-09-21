let express = require('express');
let router = express.Router();
let v1 = require('../controller/v1');

router.use('/v1/getall', v1.getTimestamp);
router.use('/v1/last',v1.getLastTimestamp)
module.exports = router;
