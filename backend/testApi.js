const http = require('http');
http.get('http://localhost:3000/api/queue/live', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(`Live Queue Count: ${json.length}`);
    console.log(json.map(q => ({ id: q.id, status: q.status, checkInTime: q.checkInTime })));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
