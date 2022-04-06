import React, {Component, useState } from "react";
import Webcam from 'react-webcam';
import { Predictions } from "aws-amplify";


const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: 'user'
}

export const WebcamCapture = () => {

    const [image, setImage]=useState('');
    const webcamRef = React.useRef(null);

    function convertScreenshot(image) {
        let imageSrc = image.split("data:image/jpeg;base64,")[1]
        imageSrc = atob(imageSrc);
        var length = imageSrc.length;
        let imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
            ua[i] = imageSrc.charCodeAt(i);
        }
        return imageBytes;
    }

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);

            Predictions.identify({
                entities: {
                    source: {
                        bytes: convertScreenshot(imageSrc)
                    },
                    collection: true
                }
            })
            .then((response) => {
                console.log({response});
            })
            .catch(err => {
                console.error(err);
            })
        },
        [webcamRef]
    );

    return (
        <div>
            <Webcam 
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                width={220}
                videoConstraints={videoConstraints}
            />
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    capture();
                }}
            >Capture</button>
            {image && (
                <img src={image} />
            )}
        </div>
    )
}

