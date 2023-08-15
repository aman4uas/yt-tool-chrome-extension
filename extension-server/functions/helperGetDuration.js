const axios = require('axios');
const MAX_RESULTS = 50; //We can fetch maximum of 50 entries (IDs) only at a time

function getPlaylistRequestLink(playlistId) {
  let link = `https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.API_KEY}&part=contentDetails&maxResults=${MAX_RESULTS}&playlistId=${playlistId}`
  return link;
}

async function getDurationHelper(items) {
  let response, data, cnt;
  let nTotal = items.length;
  let videoID = getVideosId(items);
  let apiURL = `https://youtube.googleapis.com/youtube/v3/videos?key=${process.env.API_KEY}&part=contentDetails&maxResults=${MAX_RESULTS}` + videoID;

  response = await axios.get(apiURL);
  if (response.status === 200) { }
  else {
    console.log(response);
    throw new Error("Something went wrong!! Please try again..");
  }
  data = response.data;
  cnt = data.items.length;
  let time = getTime(data.items);
  return [time, cnt, nTotal - cnt];
}

function getVideosId(items) {
  let n = items.length, str = "";
  for (let i = 0; i < n; i++) str += ("&id=" + items[i].contentDetails.videoId);
  return str;
}

function getTime(data) {
  let t = 0, n = data.length;
  for (let i = 0; i < n; i++) t += convertInSec(data[i].contentDetails.duration);
  return t;
}

function convertInSec(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  let hours = parseInt(match[1]) || 0;
  let minutes = parseInt(match[2]) || 0;
  let seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

module.exports = {
  getDurationHelper: getDurationHelper,
  getPlaylistRequestLink: getPlaylistRequestLink
}
