import React, { useState, useRef, useEffect } from "react";
import Logo from "../components/logov2";
import "../home.css";

function Home() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const cloudinaryWidgetRef = useRef();

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
          // First, update the local state with the new image
          setImages(prevImages => [...prevImages, result.info.secure_url]);
          // Then, send the new image URL to your backend for storage
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
          } catch (error) {
            console.error("Error saving the image:", error);
          }
        }
      }
    );
  }, [images]); // Dependency array includes images to re-run the effect when images state updates

  // useEffect to fetch images from backend on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setImages(data.map(img => img.imageUrl));
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

  const shuffleImage = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

const handleDeleteImage = async (imageToDelete) => {
  // Assuming imageToDelete is the image URL, you need to find the corresponding image object to get its _id
  const imageObject = images.find(img => img.imageUrl === imageToDelete);

  if (imageObject && imageObject._id) {
    try {
      const response = await fetch(`/api/images/${imageObject._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the image from the backend');
      }
      // If the image is successfully deleted from the backend, update the local state
      const newImages = images.filter((image) => image._id !== imageObject._id);
      setImages(newImages);
    } catch (error) {
      console.error("Error deleting the image:", error);
    }
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
