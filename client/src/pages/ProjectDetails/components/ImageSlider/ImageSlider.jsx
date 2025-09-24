import { useState, useEffect } from 'react';
import "./ImageSlider.css"

function ImageSlider({ images }) {
    
    const [isSliding, setIsSliding] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    const nextSlide = () => {
        if (isSliding) return;
        setIsSliding(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        if (isSliding) return;
        setIsSliding(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };
        
    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };


    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const swipeDistance = touchStartX - touchEndX;

        if (swipeDistance > 50) {
            nextSlide(); 
        } else if (swipeDistance < -50) {
            prevSlide(); 
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    return (
        <div 
            className="slider"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className='slider-track'
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: 'transform 0.8s ease-in-out'
                  }}
            >
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={image}
                        className="slider-image"
                    />
                ))}
            </div>
            <div className='dots-container'>
                {images.map((_, index) => (
                    <span 
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>

        </div>
        
    );
}

export default ImageSlider;