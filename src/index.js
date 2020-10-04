import express from "express";
import path from "path";
import fs from "fs";
import mediaserver from "mediaserver";
import multer from "multer";

const multerOptions = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, path.join(__dirname, 'songs'));    
  },
  filename: (req, file, cb)=>{
    cb(null, file.originalname)
  }
});

const upload = multer({storage: multerOptions});


const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/songs',(req, res)=>{
  fs.readFile(path.join(__dirname, 'songs.json'),'utf8',(err, songs)=>{
    if(err) throw err;
    res.json(JSON.parse(songs));
  });
});

app.get('/songs/:name', (req, res)=> {
  const song = path.join(__dirname, 'songs', req.params.name);
  mediaserver.pipe(req, res, song);
});


app.post('/songs', upload.single('song'), (req, res)=>{
  const songsPath = path.join(__dirname, 'songs.json');
  const songName = req.file.originalname;
  fs.readFile(songsPath, 'utf8', (err, file)=>{
    if(err) throw err;
    const songs = JSON.parse(file);
    songs.push({name:songName});
    fs.writeFile(songsPath, JSON.stringify(songs),(err)=>{
      if(err) throw err;
    })
    res.sendFile(path.join(__dirname, 'index.html'));
  });
});

const port = 3000;

app.listen(port, ()=> {
  console.log("running on", port);
});