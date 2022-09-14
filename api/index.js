const server = require('./src/app.js');
const { conn, Menu } = require('./src/db.js');
// const { conn } = require('./src/db.js');

async function loadMenus() {
  const menus = require('./menus.json');
  Menu.bulkCreate(menus);
};

conn.sync({ force: true }).then(async() => {
  await loadMenus();
  server.listen(process.env.PORT, () => {
    console.log("%s listening at 3001");
  });
});
