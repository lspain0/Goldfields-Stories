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

    // Return a cleanup function that removes the class
    return () => {
      document.body.classList.remove('home-page-background');
    };
  }, []);

  // useEffect for Cloudinary upload widget
  useEffect(() => {
    cloudinaryWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "drpnvb7qc",
        uploadPreset: "tetlineq",
        sources: ["local"],
        clientAllowedFormats: ["image"],
      },
      async (error, result) => {
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
            const savedImage = await response.json(); // Get the full image object from the backend
            setImages(prevImages => [...prevImages, savedImage]); // Update state with the full image object
          } catch (error) {
            console.error("Error saving the image:", error);
          }
        }
      }
    );
  }, []);

  // useEffect to fetch images from backend on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Set the entire image object in your state, not just the imageUrl
        setImages(data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };


    fetchImages();
    // Set up interval for shuffling images
    const intervalId = setInterval(shuffleImage, 3000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, []);

  // useEffect to update currentIndex when images array changes
  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(images.length - 1);
    }
  }, [images]);

  const handleImageUpload = () => {
    cloudinaryWidgetRef.current.open();
  };

  // Modify shuffleImage to randomly select an image
  const shuffleImage = () => {
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentIndex(randomIndex);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the image from the backend');
      }
      // Filter out the deleted image from your state based on _id
      const newImages = images.filter((image) => image._id !== imageId);
      setImages(newImages);
    } catch (error) {
      console.error("Error deleting the image:", error);
    }
  };


  const toggleShowImages = () => {
    setShowImages(!showImages);
  };

  const currentImage = images[currentIndex]?.imageUrl;

  return (
    <div className="home-container">
      <div className="home-header">
        <Logo2 />
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
              <img src={image.imageUrl} alt="Gallery" />
              <button onClick={() => handleDeleteImage(image._id)}>Delete</button>
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
