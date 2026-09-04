const http = require('http');

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      console.log(`Route [${path}] Status: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`Route [${path}] Error: ${err.message}`);
      resolve(null);
    });
  });
}

(async () => {
  const routes = ['/', '/archive', '/lab', '/pause', '/changelog', '/aievolutionlog', '/p/3cb4b57f-e15a-810d-b368-e2f729f90697'];
  for (const r of routes) {
    await checkRoute(r);
  }
})();
