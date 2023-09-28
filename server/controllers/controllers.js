const func = require("./functions/main");

function rootHandler(req, res) {
  res.sendFile("index.html");
}

async function resultHandler(req, res) {
  let time, count, notCount, avg_size, result;
  try {
    [time, count, notCount] = await func.getDuration(req.params.id);
  } catch (error) {
    result = {
      ok: false,
      message: error.message,
    };
    return res.send(result);
  }

  avg_size = func.getAvgSize(time, count);
  let [t100x, t125x, t150x, t175x, t200x] = func.getFormattedTime(time);

  result = {
    ok: true,
    data: {
      timeSec: time,
      count: count,
      notCount: notCount,
      avgTime: avg_size,
      t100x: t100x,
      t125x: t125x,
      t150x: t150x,
      t175x: t175x,
      t200x: t200x,
    },
  };
  res.send(result);
}

module.exports = {
  resultHandler: resultHandler,
  rootHandler: rootHandler,
};
