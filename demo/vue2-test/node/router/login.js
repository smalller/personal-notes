const { pool, router, Result } = require("../connect");

router.get("/", (req, res) => {
  pool.getConnection((err, conn) => {
    conn.query("SELECT * FROM students", (e, r) => {
      if (e) throw error;
      res.json(new Result({ data: r }));
    });
    pool.releaseConnection(conn); // 释放连接池，等待别的连接使用
  });
});

module.exports = router;
