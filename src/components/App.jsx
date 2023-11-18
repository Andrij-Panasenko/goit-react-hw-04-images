import { GlobalStyle } from './GlobalStyle';
import { useState, useEffect } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import { SearchBar } from './SearchBar/SerachBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { fetchItem } from './api/api';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [isBtnShow, setIsBtnShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query === '') {
      return;
    }

    async function getImages() {
      const searchQuery = query.split('/')[1].trim();

      if (searchQuery === '') {
        toast.error('Search field should be filled');
        return;
      }

      setIsLoading(true);
      try {
        const requestedImages = await fetchItem(searchQuery, page);

        const totalCards = requestedImages.totalHits;
        const totalPages = Math.ceil(totalCards / 12);

        if (page === totalPages) {
          setIsBtnShow(false);
          toast('You have reached the end of the search.', { icon: '🚩' });
        }

        if (requestedImages.hits.length === 0) {
          toast.error('There are no results for your request');
          return;
        }

        setImages(prevImages =>
          prevImages.length === 0
            ? requestedImages.hits
            : [...prevImages, ...requestedImages.hits]
        );
      } catch (error) {
        toast.error('Ooops! Something went wrong. Try reloading page!');
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [query, page]);

  const searchQueryHandler = evt => {
    evt.preventDefault();

    const searchQuery = evt.target.query.value;
    const query = searchQuery.toLowerCase();

    setQuery(`${Date.now()}/${query}`);
    setPage(1);
    setImages([]);
    setIsBtnShow(true);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <GlobalStyle />
      <Toaster />
      <SearchBar onSubmit={searchQueryHandler} />
      {isLoading && <Loader />}
      {images.length > 0 && (
        <>
          <ImageGallery images={images} />
          {isBtnShow && <Button onLoad={handleLoadMore} />}
        </>
      )}
    </>
  );
};
