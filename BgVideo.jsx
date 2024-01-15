import React from "react";
import { useEffect, useState, useRef } from "react";
import styles from "./bgv.module.scss";
import useIntersectionObserver from "../../hooks/use-intersectionObserver";

const videoData = {
	breakpoint: 992, //the value of window.innerWidth, above which switch the url of particular video file. (we accept the url as a props)
};

const BgVideo = ({ mobile, desk }) => {
	//props refer to urls of video files
	const videoRef = useRef();
	const [windowWidth, setWindowWidth] = useState([]);

	const { isVisible } = useIntersectionObserver(videoRef, "-100px"); // a custom hook that takes the element which we want to observe and the root margin value for intrsection observer. isVisible gives the "true" if the element is visible more then 100px. In other case - false.

	useEffect(() => {
		videoRef.current?.load(); // the necessity of invoking the .load() due to render the correct file via desk or mobile url. Otherwise, we change the url, but the propper files don't set properly.

		const handleResize = () => {
			setWindowWidth(window.innerWidth);

			videoRef.current?.load();
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [mobile, desk]);

	useEffect(() => {
		setWindowWidth(window.innerWidth);

		if (isVisible === true) {
			// we received the isVisible "true" value from custom hook and then play the video
			videoRef.current.play();
		} else {
			videoRef.current.pause(); // otherwise isVisible gives the "false", and stop the video
		}
	}, [windowWidth, isVisible]);

	return (
		<div className={styles.bgv}>
			<video controls autoPlay loop={true} muted loading="lazy" ref={videoRef}>
				<source src={windowWidth >= videoData.breakpoint ? desk : mobile} />
			</video>
		</div>
	);
};

export default BgVideo;
