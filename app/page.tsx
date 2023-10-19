"use client";

import { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import clsx from "clsx";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound("./static/sample.mp3");

  const playingButton = () => {
    if (isPlaying) {
      pause(); // this will pause the audio
      setIsPlaying(false);
    } else {
      play(); // this will play the audio
      setIsPlaying(true);
    }
  };

  const [currTime, setCurrTime] = useState({
    min: "",
    sec: "",
  }); // current position of the audio in minutes and seconds

  const [seconds, setSeconds] = useState(); // current position of the audio in seconds

  const sec = duration / 1000;
  const min = Math.floor(sec / 60);
  const secRemain = Math.floor(sec % 60);
  const time = {
    min: min,
    sec: secRemain,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])); // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min: min.toString(),
          sec: sec.toString(),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  return (
    <div className="flex justify-center h-[100vh] items-center w-full margin-auto">
      <div>
        <div className="relative h-[500px] flex justify-center margin-auto">
          <img
            className={clsx(
              "rounded-[50%] drop-shadow-lg",
              isPlaying && "spinRecord"
            )}
            src="https://picsum.photos/500/500"
            alt="record"
          />
          <div className="flex bg-[#e9d8a6] w-[75px] h-[75px] rounded-[100%] z-2 absolute top-[42%] left-[42%]"></div>
        </div>
        <div className="mt-24 w-[550px] flex justify-center">
          <button className="playButton">
            <IconContext.Provider value={{ size: "3em", color: "#0a9396" }}>
              <BiSkipPrevious />
            </IconContext.Provider>
          </button>
          {!isPlaying ? (
            <button className="playButton" onClick={playingButton}>
              <IconContext.Provider value={{ size: "3em", color: "#0a9396" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </button>
          ) : (
            <button className="playButton" onClick={playingButton}>
              <IconContext.Provider value={{ size: "3em", color: "#0a9396" }}>
                <AiFillPauseCircle />
              </IconContext.Provider>
            </button>
          )}
          <button className="playButton">
            <IconContext.Provider value={{ size: "3em", color: "#0a9396" }}>
              <BiSkipNext />
            </IconContext.Provider>
          </button>
        </div>
        {/* <div>
          <div className="time">
            <p>
              {currTime.min}:{currTime.sec}
            </p>
            <p>
              {time.min}:{time.sec}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max={duration / 1000}
            // default="0"
            value={seconds}
            className="timeline"
            onChange={(e) => {
              sound.seek([e.target.value]);
            }}
          />
        </div> */}
      </div>
    </div>
  );
}
