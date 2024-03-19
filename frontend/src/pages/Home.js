import React, { useState, useRef, useEffect } from "react";
import Logo2 from "../components/logov2";
import Logo from "../components/logo";
import "../home.css";

function Home() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const cloudinaryWidgetRef = useRef();

  useEffect(() => {
    document.body.classList.add('home-page-background');
    return () => {
      document.body.classList.remove('home-page-background');
    };
  }, []);

  useEffect(() => {
    cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget({
        cloudName: "drpnvb7qc",
        uploadPreset: "tetlineq",
        sources: ["local"],
        clientAllowedFormats: ["image"],
      }, async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            const response = await fetch('/api/images', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl: result.info.secure_url }),
            });
            if (!response.ok) {
              throw new Error('Failed to save the image to the backend');
            }
            const newImage = await response.json();
            setImages(prevImages => [...prevImages, newImage]);
            setCurrentIndex(prevIndex => prevIndex + 1); // Set to the new image
          } catch (error) {
            console.error("Error saving the image:", error);
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
    const intervalId = setInterval(() => setCurrentIndex(prevIndex => (prevIndex + 1) % images.length), 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleImageUpload = () => {
    cloudinaryWidgetRef.current.open();
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete the image');

      const filteredImages = images.filter(image => image._id !== imageId);
      setImages(filteredImages);
      if (currentIndex >= filteredImages.length) {
        setCurrentIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
      }
    } catch (error) {
      console.error("Error deleting the image:", error);
    }
  };

  const toggleShowImages = () => setShowImages(!showImages);

  const currentImage = images[currentIndex]?.imageUrl;

  return (
    <div className="home-container">
      <div className="home-header">
        <Logo2 />
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

      {showImages && (
        <div className="image-gallery">
          {images.map((image) => (
            <div key={image._id}>
              <img src={image.imageUrl} alt="Gallery" className="gallery-image"/>
              <button onClick={() => handleDeleteImage(image._id)} className="delete-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="home-content">
        <p className="home-proverb">
          I te puāwaitanga o te harakeke, he rito whakakī whāruarua - When the flax blossoms, its many offspring begin their journey
        </p>
        <h1>Nau Mai, Haere Mai</h1>
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
