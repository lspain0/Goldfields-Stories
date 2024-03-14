import React, { useState, useRef, useEffect } from "react";
import Logo from "../components/logov2";
import "../home.css";

function Home() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const cloudinaryWidgetRef = useRef();

  useEffect(() => {
    cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "drpnvb7qc",
        uploadPreset: "tetlineq",
        sources: ["local"],
        clientAllowedFormats: ["image"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImages(prevImages => [...prevImages, result.info.secure_url]);
          // No need to set currentIndex here as it's handled in the useEffect below
        }
      }
    );

    const timer = setInterval(shuffleImage, 3000);
    return () => clearInterval(timer);
  }, [images]);

  // New useEffect to set currentIndex when images array changes
  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(images.length - 1); // Set currentIndex to the last image
    }
  }, [images]); // This useEffect depends on 'images'

  const handleImageUpload = () => {
    cloudinaryWidgetRef.current.open();
  };

  const shuffleImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const handleDeleteImage = (imageToDelete) => {
    const newImages = images.filter((image) => image !== imageToDelete);
    setImages(newImages);

    if (images[currentIndex] === imageToDelete) {
      setCurrentIndex((prevIndex) => {
        return prevIndex === newImages.length ? prevIndex - 1 : prevIndex % newImages.length;
      });
    }
  };

  const toggleShowImages = () => {
    setShowImages(!showImages);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="home-container">
      <div className="home-header">
        <Logo />
      </div>
      <div className="home-image-container img">
          {currentImage && <img src={currentImage} alt="Displayed" className="student-image" />}
        </div>
        <button onClick={handleImageUpload} className="home-upload-button">
          Upload Image
        </button>
        <button onClick={toggleShowImages} className="home-upload-button">
          {showImages ? 'Hide Images' : 'View Images'}
        </button>
      <div className="home-content">
        <p className="home-proverb">
          I te puāwaitanga o te harakeke, he rito whakakī whāruarua - When the flax blossoms, its many offspring begin their journey
        </p>
        <h1>Nau Mai, Haere Mai</h1>

        {showImages && (
          <div className="home-uploaded-images">
            {images.map((image, index) => (
              <div key={index} className="home-uploaded-image">
                <img src={image} alt={`Uploaded ${index + 1}`} className="home-small-image" />
                <button onClick={() => handleDeleteImage(image)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="home-footer">
        <div className="home-contact-info">
          <p>Monday–Friday 9am–5pm</p>
          <p>55 Norwood Road</p>
          <p>Paeroa</p>
          <p>Phone: 07 862 7172</p>
          <p>Mobile: 021 277 3214</p>
          <p>Email: office@gfs.school.nz</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
