const express = require('express');
const controller = require('../controllers/diary');
const { isAuth } = require('../middlewares/isAuth');
const rbac = require('../middlewares/rbac');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router.route('/').get(isAuth, controller.get);

router
  .route('/:id')
  .get(validator({ params: 'id' }), isAuth, controller.getById)
  .get(validator({ params: 'id' }), isAuth, controller.getListDiaryById)
  .post(validator({ body: 'diary', params: 'id' }), isAuth, controller.save)
  .patch(validator({ body: 'diary', params: 'id' }), isAuth, controller.update)
  .delete(validator({ params: 'id' }), isAuth, controller.delete);

module.exports = router;
