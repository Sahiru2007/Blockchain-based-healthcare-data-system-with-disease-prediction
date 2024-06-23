



import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function App() {
  const meetingContainerRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null); // Use a ref to hold the MediaRecorder instance
  const recordedChunksRef = useRef([]); // Use a ref for recorded chunks
  const [type, setType] = useState('');
  const [appointmentID, setAppointmentID] = useState('');
  const [meetingStartTime, setMeetingStartTime] = useState(null); // Track meeting start time
  const [meetingEndTime, setMeetingEndTime] = useState(null); // Track meeting end time
  const [meetingDuration, setMeetingDuration] = useState(null); // Track meeting duration
  const [meetingID ,setmeetingID] = useState('');
  useEffect(() => {
    let mediaRecorder;
    const recordedChunks = [];

    const joinRoom = async () => {
      const pathSegments = window.location.pathname.split('/');
      const roomID = pathSegments[2] || 'defaultRoomID';
      const username = pathSegments[3] || 'defaultUsername';
      setType(pathSegments[4])
      const appointment = pathSegments[5]
      setAppointmentID(pathSegments[5])
      setmeetingID(pathSegments[6])
      console.log(pathSegments[6])
      console.log(meetingID)
      const appID = "APP_ID";
      const serverSecret = "SERVER_SECRET";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), username);
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingContainerRef.current,
        onJoinRoom: () => {
          setIsJoined(true);
          console.log("Joined the room");
          setMeetingStartTime(new Date()); // Set meeting start time when joining room
          startRecording();
        },
        onLeaveRoom: () => {
          setIsJoined(false);
          console.log("Left the room");
          stopRecording();
          setMeetingEndTime(new Date());
        },
      });
    };

    const startRecording = () => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) recordedChunks.push(event.data);
          };
          mediaRecorder.start(10); // Collect data in chunks of 10ms
          mediaRecorder.onstop = () => {
            downloadRecording(recordedChunks);
          };
        })
        .catch(console.error);
    };

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };

    const downloadRecording = (chunks) => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      uploadRecording(blob)
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meetingAudio.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    const uploadRecording = async (blob) => {
      const pathSegments = window.location.pathname.split('/');
      const meetID = pathSegments[6]
      setUploading(true);
      console.log(meetingID); // Ensure meetingID is logged correctly
      const formData = new FormData();
      formData.append('audio', blob, 'meetingAudio.webm');

      try {
        const response = await fetch(`http://localhost:8050/api/meetings/transcribe/${meetID}`, {
          method: 'POST',
          body: formData,
        });
        console.log("send")
        if (response.ok) {
          const data = await response.json();
          setTranscription(data.transcription);
        } else {
          console.error('Failed to upload and transcribe the recording.');
          alert('Failed to upload and transcribe the recording.');
        }
        
      } catch (error) {
        console.error('Error uploading recording:', error);
      } finally {
        setUploading(false);
        setMeetingEndTime(new Date()); // Set meeting end time when upload is complete
      }
    
    };
    
    
    
    joinRoom();


    return () => {
      stopRecording();
    };
  }, [appointmentID, meetingID]);

 
  return (
    <div className="myCallContainer" ref={meetingContainerRef} style={{ width: '100vw', height: '100vh' }}>
      <p>Meeting Duration: {meetingDuration !== null ? `${meetingDuration} seconds` : 'Calculating...'}</p>
    </div>
  );
}
