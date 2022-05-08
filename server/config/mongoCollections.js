const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};


module.exports = {
Movie: getCollectionFn('Movie'),
SaveMovie:getCollectionFn('SaveMovie'),
Comments: getCollectionFn('Comments'),
UserImage:  getCollectionFn('UserImage')

};