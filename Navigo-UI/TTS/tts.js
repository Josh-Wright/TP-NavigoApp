import React, { useState } from "react";

// Import react's built-in speech-to-text module;
// note that this is primarily for browsers, so there may be better-suited solutions for mobile applications.
// SpeechRecognition is the default import from the react-speech-recognition module that controls usage via an interface,
// useSpeechRecognition is a hook that allows for managing the module's state (e.g. fetching the transcript).
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// TODO: Import or write a polyfill for greater chance of speech-to-text working in other environments:
// https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/POLYFILLS.md

// Declare local names for the most common SpeechRecognition functions
const startListening = SpeechRecognition.startListening,
    stopListening = SpeechRecognition.stopListening,
    abortListening = SpeechRecognition.abortListening;

// Fetch the relevant values from the hook
const { transcript, resetTranscript, browserSupportsSpeechRecognition, browserSupportsContinuousListening, isMicrophoneAvailable } = useSpeechRecognition();



// Assume the language is English until told otherwise via setLanguageState
const [_language, setLanguageState] = useState("en-GB");

/**
 * @description List of supported languages:
 * https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/API.md#language-string
 * @param {string} language
 * @return {void} */
function setLanguage(language) {
    setLanguageState(language)
}



/**
 * @description Listens for speech using the device's microphone and returns the transcript after the user stops speaking.
 * @param {boolean} isContinuous
 * @return {string} */
function listenToSpeech(isContinuous = false) {
    try {
        // Check that the device is capable of completing the routine before continuing
        if (!isMicrophoneAvailable) { throw {name: "DeviceError",
                                          message: "Microphone unavailable"} }
        if (!browserSupportsSpeechRecognition) { throw { name: "UnsupportedError",
                                                      message: "Speech recognition not supported" } }
        if (!browserSupportsContinuousListening && isContinuous) { throw { name: "UnsupportedError",
                                                                        message: "Continuous listening not supported" } }

        // Set the listening options
        const options = {
            language: _language,
            interimResults: undefined,
            continuous: isContinuous
        }

        startListening(options); // If continuous == false, the listener should automatically stop listening
                                 // after the user stops speaking

        if (isContinuous) {
            // Ensure the transcript is clear so previous transcripts aren't carried over
            resetTranscript();

            // TODO: implement a method to detect when to stop listening (most likely via a button or
            // verbal 'stop' command followed by silence) —
            // the only user case I can think of where continuous should be true would be when calling support,
            // but even then the call itself doesn't have to be done through the app.
            stopListening();
            throw { name: "NotImplementedError", message: "Currently no manual way to stop continuous listening" }
        }

        return transcript
    }
    catch(e) {
        abortListening();
        throw e
    }
}



// TODO: maybe add outputDevice as a param? I'm not sure whether the output device is a property of window or not.
/**
 * @description Audibly plays the inputted text through the given output device.
 * @param {string} text
 * @return {void} */
function convertToSpeech(text) {
    // Create an instance of the utterance and set its properties
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = _language

    // Stop any currently on-going speech — the most recent update is more important
    // TODO: add option to wait until after the previous speech has completed
    window.speechSynthesis.cancel();

    try {
        window.speechSynthesis.speak(utterance);
    }
    catch(e) {
        throw e
    }
}
