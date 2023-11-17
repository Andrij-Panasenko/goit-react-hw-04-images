import { useState } from 'react';
import { ImageModal } from 'components/ImageModal/ImageModal';
import { Image, Li } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ alt, preview, large }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
      <>
        <Li onClick={()=> {setIsModalOpen(true)}}>
          <Image alt={alt} src={preview} />
        </Li>

        <ImageModal
          isOpen={isModalOpen}
          onClose={()=> {setIsModalOpen(false)}}
          alt={alt}
          large={large}
        />
      </>
    );
  }

