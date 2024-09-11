import React, { Component } from "react";


const GalleryPage = () => {
  const images = [
    {
      src: '/imglib/GalleryImg/GlyGen Interns.jpg',
      alt: 'GlyGen Summer Interns',
      title: 'GlyGen Summer Interns',
      description: 'The GlygGen Interns completing their summer internship 2024.',
    },
    {
        src: '/imglib/GalleryImg/LabMembers.jpg',
        alt: 'HIVE Lab members',
        title: 'HIVE Lab Members gathering',
        description: 'HIVE Lab Potluck, May 2024',
      },
    {
      src: '/imglib/GalleryImg/JonathonTalk.jpg',
      alt: 'Jonathon Talk',
      title: 'BCO conference',
      description: 'Dr.Keeney giving a talk in the BCO FDA conference, May 2024',
    },
    {
        src: '/imglib/GalleryImg/ISCBConference.jpg',
        alt: 'ISMBConference',
        title: 'ISMBConference',
        description: 'Biomarker Team at the International conference on intelligent systems for molecular biology (ISMB), Montreal, 2024',
      },

    {
    src: '/imglib/GalleryImg/BCOTeam.jpg',
    alt: 'BCOTeam',
    title: 'BCO Team',
    description: 'BioCompute Objects Team at BioCompute Conference and Workshop hosted at the FDA, 2024',
    },
    {
        src: '/imglib/GalleryImg/TianyiWangPoster.jpg',
        alt: 'BioCompute Conference and Workshop, FDA',
        title: 'BioCompute Conference and Workshop, FDA',
        description: 'Research Associate Tianyi Wang (BioCompute Objects Project) presenting a poster on Visualization for Published BCO at the 2024 BioCompute Conference and Workshop hosted at the FDA, 2024',
    },
  ];

  return (
    <div className="gallery-container">
      {images.map((image, index) => (
        <div className="gallery-item" key={index}>
          <img src={image.src} alt={image.alt} className="gallery-img" />
          <div className="image-overlay">
            <div className="image-title">{image.title}</div>
            <div className="image-description">{image.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryPage;
