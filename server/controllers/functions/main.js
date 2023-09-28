const axios = require('axios');
const helper1 = require('./helperGetDuration');
const helper2 = require('./helperTimeFunction');

const getDuration = async (playlistID) => {
  
  let playListRequestLink = helper1.getPlaylistRequestLink(playlistID);
  let time_sec = 0, counts = 0, notCounts = 0, nextPageToken = null, flag = true;

  while (flag) {
    let apiURL = playListRequestLink, time, cnt, notCnt, response, data;
    if (nextPageToken !== null) apiURL += `&pageToken=${nextPageToken}`;
    response = await axios.get(apiURL);
    if (response.status === 200) { }
    else if (response.status === 404) throw new Error("Playlist not found !!  Please check the link and try again..")
    else throw new Error("Something went wrong!! Please try again..");
    data = response.data;
    if (data.nextPageToken) nextPageToken = data.nextPageToken;
    else flag = false;
    [time, cnt, notCnt] = await helper1.getDurationHelper(data.items);
    time_sec += time; counts += cnt; notCounts += notCnt;
  }

  return [time_sec, counts, notCounts];
}

function getFormattedTime(time) {

  let t100x = helper2.convertTimeToString(helper2.time100x(time));
  let t125x = helper2.convertTimeToString(helper2.time125x(time));
  let t150x = helper2.convertTimeToString(helper2.time150x(time));
  let t175x = helper2.convertTimeToString(helper2.time175x(time));
  let t200x = helper2.convertTimeToString(helper2.time200x(time));

  return [t100x, t125x, t150x, t175x, t200x];
}


function getAvgSize(time, count) {
  const [dd, hh, mm, ss] = helper2.time100x(Math.floor(time / count));
  let str = "";
  if (dd !== 0) str += (dd + " days, ");
  if (hh !== 0) str += (hh + " hours, ");
  str += (mm + " minutes, ");
  str += (ss + " seconds");
  return str;
}

module.exports = {
  getDuration: getDuration,
  getAvgSize: getAvgSize,
  getFormattedTime: getFormattedTime
};

