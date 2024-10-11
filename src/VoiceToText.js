import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles.css'; // Đảm bảo file CSS được import

const AudioUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [error, setError] = useState("");

  // Tạo hiệu ứng tuyết rơi khi component được render
  useEffect(() => {
    createSnowflakes(50);
  }, []);

  // Hàm tạo tuyết
  const createSnowflakes = (num) => {
    const container = document.getElementById('snowflakes');
    for (let i = 0; i < num; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.style.width = `${Math.random() * 5 + 2}px`; // Kích thước ngẫu nhiên
      snowflake.style.height = snowflake.style.width;
      snowflake.style.left = `${Math.random() * 100}vw`; // Vị trí ngẫu nhiên trên trục X
      snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Tốc độ rơi ngẫu nhiên
      snowflake.style.opacity = `${Math.random() + 0.3}`; // Độ mờ ngẫu nhiên
      container.appendChild(snowflake);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(""); // Clear any previous errors
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("language", language);

    try {
      // Gửi yêu cầu đến API để upload file âm thanh và lấy kết quả
      const response = await axios.post("https://voiceai-nk9v.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Lưu kết quả đã thêm dấu câu
      setTranscribedText(response.data.text);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred while transcribing the audio.");
    }
  };

  return (
    <div className="container">
      <h2>Upload Audio and Transcribe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="language">Choose Language:</label>
          <select id="language" value={language} onChange={handleLanguageChange}>
            <option value="en-US">English</option>
            <option value="ru-RU">Russian</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="zh-CN">Chinese</option>
            <option value="vi-VN">Vietnamese</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="audioFile">Choose Audio File (MP3 or WAV):</label>
          <input type="file" id="audioFile" accept=".mp3, .wav" onChange={handleFileChange} />
        </div>

        <button type="submit">Upload and Transcribe</button>
      </form>

      <div id="snowflakes"></div> {/* Tuyết rơi */}

      {error && <div className="error">{error}</div>}
      {transcribedText && (
        <div className="result">
          <h3>Transcribed Text with Punctuation:</h3> {/* Chỉnh lại tiêu đề để rõ ràng hơn */}
          <p>{transcribedText}</p> {/* Hiển thị văn bản đã được thêm dấu câu */}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
