import React, { useState, useRef } from "react";
import { Button, message } from "antd";

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioFile = new File([audioBlob], "audioMessage.mp3", {
          type: "audio/mp3",
        });
        setAudioUrl(URL.createObjectURL(audioBlob)); // For playback
        onAudioRecorded(audioFile); // Send file to parent component
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      message.error("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </Button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
};

export default AudioRecorder;
