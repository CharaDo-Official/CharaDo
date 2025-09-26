// src/App.tsx
import { useRef } from "react";
import FileIOTest from "./FileIOTest";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    videoRef.current?.play();
  };

  return (
    <div className="p-4">
      <video
        ref={videoRef}
        src="video/output025_01.webm" // public/video/output.webm などに置く
        width={480}
        controls
      />
      <button
        onClick={handlePlay}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        再生
      </button>
			
			<FileIOTest label="Test Button" />
    </div>
  );
}

export default App;
