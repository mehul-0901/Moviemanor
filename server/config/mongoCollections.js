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
Movie: getCollectionFn(`${process.env.ATLAS_MOVIE_COLLECTION}`),
SaveMovie:getCollectionFn(`${process.env.ATLAS_SAVE_MOVIE_COLLECTION}`),
Comments: getCollectionFn(`${process.env.ATLAS_COMMENTS_COLLECTION}`),
UserImage:  getCollectionFn(`${process.env.ATLAS_USERIMAGE_COLLECTION}`)
};