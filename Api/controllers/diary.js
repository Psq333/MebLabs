const Diary = require('../models/diary');
const { SendData, ServerError, NotFound, Unauthorized } = require('../helpers/response');
const { canGetDiary, canDeleteDiary, canUpdateDiary, getDiariesForUser } = require('../rbac/diary');
const getter = require('../helpers/getter');
const { canGetCompany } = require('../rbac/companies');


module.exports.get = async (req, res, next) => {
  try {
    const query = Query(req.query);
    const data = await getter(User, query, req, res, [...User.getFields('listing'), 'company']);

    return next(SendData(data));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.getListDiaryById = async ({ params: { id } }, { locals: { user } }, next) => {
  try {
    const hasPermission = await canGetDiary(user, userId);
    if (!hasPermission) return next(Unauthorized());

    const diaries = await getDiariesForUser(id);
    if (diaries.length === 0) return next(NotFound());

    return next(SendData(diaries.map(diary => diary.response('cp'))));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.getById = async ({ params: { id } }, { locals: { user } }, next) => {
  try {
    const targetDiary = await canGetDiary(user, id);
    if (targetDiary === null) return next(NotFound());
    if (!targetDiary) return next(Unauthorized());

    return next(SendData(targetDiary.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.update = async ({ params: { id }, body }, { locals: { user } }, next) => {
  try {
    const targetDiary = await canUpdateDiary(user, id);
    if (targetDiary === null) return next(NotFound());
    if (!targetDiary) return next(Unauthorized());

    const data = Object.assign(targetDiary, body);

    data.__history = {
      event: 'update',
      method: 'patch',
      diary: id,
    };

    await data.save();

    return next(SendData(targetDiary.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.save = async ({ params: { id }, body }, { locals: { user } }, next) => {
  try {
    const targetDiary = await canUpdateDiary(user, id);
    if (targetDiary === null) return next(NotFound());
    if (!targetDiary) return next(Unauthorized());

    const data = Object.assign(targetDiary, body);

    data.__history = {
      event: 'save',
      method: 'post',
      diary: id,
    };

    await data.save();

    return next(SendData(targetDiary.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

module.exports.delete = async ({ params: { id } }, { locals: { user } }, next) => {
  try {
    const targetDiary = await canDeleteDiary(user, id);
    if (targetDiary === null) return next(NotFound());
    if (!targetDiary) return next(Unauthorized());

    targetDiary.__history = {
      event: 'delete',
      method: 'delete',
      diary: id,
    };

    await targetDiary.softDelete();

    return next(SendData({ message: 'User deleted successfully' }));
  } catch (err) {
    return next(ServerError(err));
  }
};


