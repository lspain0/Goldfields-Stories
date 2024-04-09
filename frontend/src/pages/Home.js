import React, { useState, useRef, useEffect } from "react";
import Logo2 from "../components/logov2";
import Logo from "../components/logo";
import "../home.css";
import { MapContainer, TileLayer, Marker, Popup, } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function Home() {
  const [role, setRole] = useState("");

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const cloudinaryWidgetRef = useRef();

  useEffect(() => {

    setRole(localStorage.getItem("role"));

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
    const intervalId = setInterval(() => setCurrentIndex(prevIndex => (prevIndex + 1) % images.length), 3100);
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
  const position = [-37.370352, 175.674033];
  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="home-container">
      <div className="home-header">
        <Logo2 />
      </div>

      <div className="home-image-container img">
        {currentImage && <img src={currentImage} alt="Displayed" className="student-image" />}
      </div>

      {
        role == "Admin" &&
        <>
          <button onClick={handleImageUpload} className="home-upload-button">
            Upload Image
          </button>
          <button onClick={toggleShowImages} className="home-upload-button">
            {showImages ? 'Hide Images' : 'View Images'}
          </button>
        </>
      }

      {showImages && (
        <div className="image-gallery">
          {images.map((image) => (
            <div key={image._id}>
              <img src={image.imageUrl} alt="Gallery" className="gallery-image" />
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
        <p className="home-welcome">
          Nau Mai, Haere Mai
        </p>

      </div>
      <div className="home-footer">
        <div className="home-contact-info">
          <div className="logo-container-home">
            <Logo />
          </div>
          <div className="contact-details">
            <p className="contact-highlight">Monday–Friday 9am–5pm</p>
            <p>&nbsp;</p>
            <p className="contact-normal">55 Norwood Road</p>
            <p className="contact-normal">Paeroa</p>
            <p>&nbsp;</p>
            <p className="contact-normal">Phone: 07 862 7172</p>
            <p className="contact-normal">Mobile: 021 277 3214</p>
            <p className="contact-email">Email: <a href="mailto:office@gfs.school.nz">office@gfs.school.nz</a></p>
          </div>
          {/* Leaflet Map */}
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="leaflet-map-container">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
          {/* End of Leaflet Map */}
        </div>
      </div>
    </div>
  );
}

export default Home;
