const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = [
  { "format": "Drama", "title": "When I Fly Towards You", "genre": "Romance", "rating": 10, "watched": 24, "episodes": 24, "progress": "100%" },
  { "format": "Movie", "title": "How to Train Your Dragon", "genre": "Adventure", "rating": 9, "watched": 1, "episodes": 1, "progress": "100%" },
  { "format": "TV Show", "title": "Wednesday", "genre": "Mystery", "rating": 7.5, "watched": 7, "episodes": 8, "progress": "88%" },
]

const server = http.createServer( function( request, response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  } else if( request.method === "DELETE" ){
    handleDelete( request, response )
  } else if( request.method === "PATCH" ){
    handlePatch( request, response )
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  } else if( request.url === "/results" ) {
    response.writeHead( 200, "OK", {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  } else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data
  })

  request.on( "end", function() {
    console.log( JSON.parse( dataString ) )
    const parsedData = JSON.parse( dataString )

    parsedData.progress = calculateProgress(parsedData.watched, parsedData.episodes);

    appdata.push( parsedData )
    response.writeHead( 200, "OK", {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  })
}

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

const handleDelete = function ( request, response ) {
  if( request.url.startsWith("/delete?index=")) {
    const row = request.url.split("=")[1];
    const index = parseInt(row);
    appdata.splice(index, 1);

    response.writeHead( 200, "OK", {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  } else {
    response.writeHead( 400, "BAD", {"Content-Type": "application/json" })
    response.end(JSON.stringify({error: response.error}))
  }
}

const handlePatch = function( request, response ) {
  if( request.url === "/update" ) {
    let dataString = ""

    request.on( "data", function( data ) {
      dataString += data
    })

    request.on( "end", () => {
      console.log( JSON.parse( dataString ) )
      const parsedNewData = JSON.parse( dataString )
      const index = parsedNewData.index;
      const field = parsedNewData.field;

      appdata[index][field] = parsedNewData.newInfo;
      appdata[index].progress = calculateProgress(appdata[index].watched, appdata[index].episodes);

      response.writeHead( 200, "OK", {"Content-Type": "application/json" })
      response.end(JSON.stringify(appdata))
    })
  }
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
