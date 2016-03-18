/* Easter eggs du trombi. */

(function(k,a,s,c,z){addEventListener("keydown",function(e){k.push(e.keyCode)
if(k[0xa])k.shift()
if(k[9]&&String.fromCharCode.apply(0,k)==="&&((%'%'BA")
{c=7;z=a.currentTime;s.forEach(p);document.body.classList.toggle("special")}})
function p(f,i){var d=c--?1/6:1,o=a.createOscillator()
o.connect(a.destination);o.frequency.value=f
o.start(z+i/6);o.stop(z+i/6+d-d%(1/f/2))}})
  ([],new (window.AudioContext||webkitAudioContext)(),[783,740,622,440,415,659,830,1047])
