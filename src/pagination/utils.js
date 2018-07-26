const casual = require('casual');

function generateBookDatas(count = 2, idFn) {
  const datas = [];
  for (let i = 0; i < count; i += 1) {
    const data = {
      _id: idFn(),
      title: casual.title,
      author: casual.full_name
    };
    datas.push(data);
  }
  return datas;
}

module.exports = {
  generateBookDatas
};
