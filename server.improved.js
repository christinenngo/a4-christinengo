const express = require( 'express' ),
    app = express(),
    appdata = [
      { "format": "Drama", "title": "When I Fly Towards You", "genre": "Romance", "rating": 10, "watched": 24, "episodes": 24, "progress": "100%" },
      { "format": "Movie", "title": "How to Train Your Dragon", "genre": "Adventure", "rating": 9, "watched": 1, "episodes": 1, "progress": "100%" },
      { "format": "TV Show", "title": "Wednesday", "genre": "Mystery", "rating": 7.5, "watched": 7, "episodes": 8, "progress": "88%" },
    ]

app.use( express.static( 'public' ) )
app.use( express.json())

// const middleware_post = (req, res, next) => {
//   let dataString = ''
//
//   req.on( 'data', function(data) {
//     dataString += data;
//   })
//
//   req.on( 'end', function() {
//     const json = JSON.parse(dataString);
//     appdata.push(json);
//
//     req.json = JSON.stringify(appdata);
//
//     next()
//   })
// }
//
// app.use( middleware_post )

app.get( '/results', ( req, res ) => {
  res.writeHead( 200, { 'Content-Type': 'application/json' })
  res.end( JSON.stringify( appdata ))
})

app.post( '/submit', ( req, res ) => {
  const data = req.body;

  data.progress = calculateProgress(data.watched, data.episodes);

  appdata.push( data )
  res.writeHead( 200, "OK", {"Content-Type": "application/json" })
  res.end(JSON.stringify(appdata))
})

app.delete( '/delete', ( req, res ) => {
  if( req.url.startsWith("/delete?index=")) {
    const row = req.url.split("=")[1];
    const index = parseInt(row);
    appdata.splice(index, 1);

    res.writeHead( 200, "OK", {"Content-Type": "application/json" })
    res.end(JSON.stringify(appdata))
  } else {
    res.writeHead( 400, "BAD", {"Content-Type": "application/json" })
    res.end(JSON.stringify({error: res.error}))
  }
})

app.patch( '/update', ( req, res ) => {
  const newData = req.body;
  const index = newData.index;
  const field = newData.field;

  appdata[index][field] = newData.newInfo;
  appdata[index].progress = calculateProgress(appdata[index].watched, appdata[index].episodes);

  res.writeHead( 200, "OK", {"Content-Type": "application/json" })
  res.end(JSON.stringify(appdata))
})

const calculateProgress = function ( watched, total ) {
  const p = Math.floor((watched / total) * 100);
  if (p > 100) {
    return "100%";
  } else if (p >= 0) {
    return p + "%";
  } else {
    return "0%";
  }
}

app.listen( process.env.PORT || 3000 )