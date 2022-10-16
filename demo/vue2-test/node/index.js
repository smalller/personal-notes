const { app, pool, Result } = require("./connect");
const login = require("./router/login");
app.all("*", (req, res, next) => {
  //这里处理全局拦截，一定要写在最上面
  next();
});
app.all("/", (req, res) => {
  pool.getConnection((err, conn) => {
    res.json({ type: "test" });
    pool.releaseConnection(conn); // 释放连接池，等待别的连接使用
  });
});
app.use("/login", login);
app.listen(8088, () => {
  console.log("服务启动");
});
