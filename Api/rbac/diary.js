const User = require('../models/diary');
const { intersection } = require('../helpers/utils');

const diaryRbac = async (caller,resourceId, { authorizedRoles = [], customCondition, onHimself = false }) => {
  const diary = await Diary.findById(resourceId, {});
  if (!diary) return null;

  const { id: _id} = caller;

  if(_id?.toString() != diary.userId.toString()) return false;

  return diary;
};

module.exports.diaryRbac = diaryRbac;

module.exports.canGetDiary = (caller, userId, diaryId) =>
  diaryRbac(caller, resourceId, { onHimself: true });

module.exports.canUpdateDiary = (caller, userId, diaryId) =>
  diaryRbac(caller, resourceId, { onHimself: true });

module.exports.canSaveDiary = (caller, userId, diaryId) =>
  diaryRbac(caller, resourceId, { onHimself: true });

module.exports.canDeleteDiary = (caller, userId, diaryId) =>
  diaryRbac(caller, resourceId, { onHimself: false });

const getDiariesForUser = async (userId) => {
  return await DiaryModel.find({ userId }).exec();
};
