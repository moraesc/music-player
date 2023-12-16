"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import clsx from "clsx";
import "./globals.css";
import Image from "next/image";
import { DATA } from "./data";
import { useMediaQuery } from "usehooks-ts";

export default function Home() {
  const tablet = useMediaQuery("(min-width: 768px)");

  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [position, setPosition] = useState();

  const cdRef = useRef<HTMLImageElement>();

  console.log("cdRef: ", cdRef.current?.style.getPropertyValue("rotate"));

  const [count, setCount] = useState(0);

  const { title, artist, coverArt, audio, gradient } = DATA[count];

  const audioRef = useRef<HTMLAudioElement>();
  const intervalRef = useRef();
  const isReady = useRef(false);

  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current = new Audio(audio);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current && !isPlaying) {
      audioRef.current.play();
      // setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [count]);

  const playingButton = () => {
    if (isPlaying) {
      audioRef.current?.pause(); // this will pause the audio
      setIsPlaying(false);
    } else {
      audioRef.current?.play(); // this will play the audio
      setIsPlaying(true);
    }
  };

  const [rotation, setRotation] = useState(0);

  // useEffect(() => {
  //   if (isPlaying) {
  //     document.getElementById('cd')?.style.transform = `rotate(${rotation}deg)`
  //   }
  // }, [isPlaying])

  const rotateForward = () => {
    const newAudioNumber = count + 1;
    setCount(newAudioNumber);
    console.log("exists? ", document.getElementById("cd"));
    document.getElementById("cd").className = clsx(
      "rotate-forward",
      isPlaying && "spinRecord"
    );
  };

  const rotateBackward = () => {
    const newAudioNumber = count - 1;
    setCount(newAudioNumber);
    console.log("exists? ", document.getElementById("cd"));
    document.getElementById("cd").className = clsx(
      "rotate-backward",
      isPlaying && "spinRecord"
    );
  };

  const startTimer = useCallback(() => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current?.ended) {
        rotateForward();
      } else {
        console.log("in else: ", audioRef.current);
        if (!audioRef.current) return;
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  }, [rotateForward]);

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current?.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current?.pause();
    }
  }, [isPlaying, startTimer]);

  const currentPercentage = audioRef.current?.duration
    ? `${(trackProgress / audioRef.current.duration) * 100}%`
    : "0%";

  return (
    <div
      className="flex justify-center h-[100vh] items-center w-full margin-auto"
      style={{ background: gradient }}
    >
      <div>
        <div className="relative flex justify-center margin-auto relative w-[325px] md:w-[450px]  items-center">
          <div className="rounded-r-[30px] rounded-l-[100px] bg-white w-[325px] h-[120px] md:w-[450px] md:h-[150px] shadow-lg flex flex-col gap-[40px]">
            <div className="flex flex-col left-[150px] md:left-[190px] top-[15px] relative">
              <p className="text-[14px] md:text-[16px] font-medium z-2">
                {title}
              </p>
              <p className="text-[12px] md:text-[14px]">{artist}</p>
            </div>
            <audio src={audio} ref={audioRef ?? null} preload="metadata">
              <source type="audio/mpeg" src={audio} />
            </audio>
            <input
              type="range"
              value={trackProgress}
              step="1"
              min="0"
              max={audioRef.current ? audioRef.current.duration : `0`}
              className="progress w-[162px] md:w-[230px] relative left-[150px] md:left-[190px] bottom-[16px] md:bottom-[10px]"
              onChange={(e) => onScrub(e.target.value)}
              onMouseUp={onScrubEnd}
              onKeyUp={onScrubEnd}
              style={{
                background: `-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #9dcdf7), color-stop(${currentPercentage}, #e4e4e4))`,
              }}
            />
            <div className="flex left-[143px] md:left-[181px] justify-between w-[177px] md:w-[250px] relative bottom-[56px] md:bottom-[45px]">
              <button className="playButton" onClick={rotateBackward}>
                <IconContext.Provider
                  value={{ size: tablet ? "36px" : "30px", color: "#232323" }}
                >
                  <BiSkipPrevious />
                </IconContext.Provider>
              </button>
              {!isPlaying ? (
                <button className="playButton" onClick={playingButton}>
                  <IconContext.Provider
                    value={{ size: tablet ? "36px" : "30px", color: "#232323" }}
                  >
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </button>
              ) : (
                <button className="playButton" onClick={playingButton}>
                  <IconContext.Provider
                    value={{ size: tablet ? "36px" : "30px", color: "#232323" }}
                  >
                    <AiFillPauseCircle />
                  </IconContext.Provider>
                </button>
              )}
              <button className="playButton" onClick={rotateForward}>
                <IconContext.Provider
                  value={{ size: tablet ? "36px" : "30px", color: "#232323" }}
                >
                  <BiSkipNext />
                </IconContext.Provider>
              </button>
            </div>
          </div>
          <div className="absolute w-[140px] md:w-[175px] left-0 z-100">
            <Image
              id="cd"
              ref={cdRef}
              className={clsx(
                "rounded-[50%] drop-shadow-lg opacity-100",
                isPlaying && "spinRecord"
              )}
              width={175}
              height={175}
              src={coverArt}
              alt="record"
            />
            <div className="flex w-[12px] h-[12px] md:w-[14px] md:h-[14px] rounded-[100%] z-2 absolute top-[70px] left-[66px] md:top-[80px] md:left-[80px] bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
