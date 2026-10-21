"""Original 16-bar prototype jazz loop: electric piano, bass, brushed drums, soft lead."""
import numpy as np
import wave
from pathlib import Path
SR = 32000
beat = 60 / 78
length = 64 * beat
rng = np.random.default_rng(12)
audio = np.zeros((int((length + 4) * SR), 2))
def note(midi): return 440 * 2 ** ((midi - 69) / 12)
def add(signal, start, amp, pan=0):
    i = int(start * SR)
    n = min(len(signal), len(audio)-i)
    audio[i:i+n,0] += signal[:n] * amp * np.sqrt((1-pan)/2)
    audio[i:i+n,1] += signal[:n] * amp * np.sqrt((1+pan)/2)
def keys(midi, start, duration, amp=.12):
    t=np.arange(int(duration*SR))/SR; f=note(midi)
    env=(1-np.exp(-t*180))*np.exp(-t/1.3)*np.minimum(1,(duration-t)/.12)
    sound=(np.sin(2*np.pi*f*t+1.2*np.sin(2*np.pi*f*t)*np.exp(-t*4))+.16*np.sin(2*np.pi*f*2*t))*env
    add(sound,start,amp,-.26)
def bass(midi, start):
    t=np.arange(int(.85*beat*SR))/SR; f=note(midi)
    env=(1-np.exp(-t*90))*np.exp(-t*4)*np.minimum(1,(t[-1]-t)/.07)
    add((np.sin(2*np.pi*f*t)+.18*np.sin(4*np.pi*f*t))*env,start,.30,.08)
def lead(midi,start,duration):
    t=np.arange(int(duration*SR))/SR; f=note(midi)
    phase=2*np.pi*f*t + .025*f*np.sin(2*np.pi*5*t)*np.minimum(1,t*2)
    env=(1-np.exp(-t*22))*np.minimum(1,(duration-t)/.16)*np.exp(-t*.6)
    signal=sum(a*np.sin(phase*k) for k,a in [(1,1),(2,.28),(3,.11),(4,.04)])
    add(signal*env,start,.075,.3)
# Dm9 / G13 / Cmaj9 / A7alt and a second, resolving eight-bar phrase.
chords=[[53,57,60,64,69],[53,59,64,69],[52,55,59,62,67],[55,61,65,70],
        [53,57,60,64,69],[53,59,64,69],[52,55,59,62,67],[55,61,65,70],
        [57,60,64,67],[56,60,63,67],[55,59,62,66],[54,58,61,65],
        [53,57,60,64],[53,59,64,69],[52,55,59,62],[55,61,65,70]]
roots=[38,31,36,33,38,31,36,33,41,34,40,33,38,31,36,33]
for bar,(chord,root) in enumerate(zip(chords,roots)):
    for off,strength in [(0,.10),(1.67,.065),(3,.075)]:
        for k,midi in enumerate(chord): keys(midi,(bar*4+off)*beat+k*.012,2.5*beat,strength)
    for off,midi in [(0,root),(1.65,root+7),(2.65,root+12),(3.5,root+7)]: bass(midi,(bar*4+off)*beat)
    for b in range(4):
        start=(bar*4+b)*beat
        t=np.arange(int(.18*SR))/SR; noise=rng.normal(0,1,len(t)); bright=np.r_[0,np.diff(noise)]
        add(bright*np.exp(-t*45),start,.013 if b%2==0 else .022,.45)
        if b%2:
            t=np.arange(int(.23*SR))/SR; brush=rng.normal(0,1,len(t)); brush=np.convolve(brush,np.ones(5)/5,mode='same')
            add(brush*(1-np.exp(-t*160))*np.exp(-t*19),start,.06,-.15)
        else:
            t=np.arange(int(.18*SR))/SR
            add(np.sin(2*np.pi*(48*t+2*(1-np.exp(-t*25))))*np.exp(-t*27),start,.09)
melody=[(0,1,69,.65),(0,2,72,.7),(0,3,76,.8),(1,.7,74,1.2),(1,2.7,71,.7),(2,0,67,1.8),(2,2.7,64,.8),
 (4,.7,69,.8),(4,2,72,.6),(4,2.7,76,1),(5,1,74,.8),(5,2.5,71,.8),(6,0,67,2.5),
 (8,.7,72,.7),(8,2,76,1.5),(9,1,75,1.1),(9,2.7,72,.8),(10,0,71,1.5),(10,2.5,69,.8),(11,1,68,1.8),
 (12,.7,69,.8),(12,2,72,.8),(13,0,71,1.2),(13,2,69,.8),(14,0,67,2.3),(15,2.5,64,.8)]
for bar,off,midi,d in melody: lead(midi,(bar*4+off)*beat,d*beat)
# Small stereo room and tape-like saturation; fold tails into the loop start.
dry=audio.copy()
for delay,level in [(.071,.09),(.113,.07),(.227,.07),(.361,.055)]:
    n=int(delay*SR); audio[n:]+=dry[:-n,::-1]*level
n=int(length*SR); tail=audio[n:]; audio=audio[:n]; audio[:len(tail)]+=tail
audio=np.tanh(audio*1.3); audio*=.79/max(1e-6,np.max(np.abs(audio)))
path=Path('/private/tmp/magazine-jazz.wav')
with wave.open(str(path),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((audio*32767).astype('<i2').tobytes())
print(f'{length:.2f}s original loop: {path}')
