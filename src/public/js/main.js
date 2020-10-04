const listSongs = async ()=> {
  const response = await fetch('/songs');
  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }else{
    const songs = await response.json();
    const list = document.getElementsByClassName('song-list')[0];  
    emptyNode(list);
    songs.forEach(song => {
      const item = document.createElement('li');
      item.className = 'song';
      item.innerHTML= song.name;
      item.addEventListener('click', play);
      list.appendChild(item);
    });

    
  }
};

const emptyNode = (node) => {
  while(node.firstChild){
    node.removeChild(node.firstChild);
  }
}

const play = (event)=> {
  const audio = document.getElementsByTagName('audio')[0];
  audio.pause();
  audio.src = "/songs/" + event.target.innerHTML;
  audio.play();
}


listSongs();