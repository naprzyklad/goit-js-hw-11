import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  let currentPage = 1;
  let currentQuery = '';
  let isLoading = false;
  let lightbox = new SimpleLightbox('.gallery a', {});

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    currentQuery = event.target.elements.searchQuery.value;
    currentPage = 1;
    gallery.innerHTML = '';
    fetchImages(currentQuery, currentPage);
  });

  async function fetchImages(query, page) {
    isLoading = true;
    const apiKey = '41785648-f43bb48e8e18549a52f9d9da0';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hits.length === 0) {
        alert(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        isLoading = false;
        return;
      }

      data.hits.forEach(image => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';

        const link = document.createElement('a');
        link.href = image.largeImageURL;
        link.setAttribute('data-lightbox', 'gallery');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        link.appendChild(img);

        const description = document.createElement('div');
        description.className = 'photo-description';
        description.innerHTML = `
                    <p>Likes: ${image.likes}</p>
                    <p>Views: ${image.views}</p>
                    <p>Comments: ${image.comments}</p>
                    <p>Downloads: ${image.downloads}</p>
                `;

        photoCard.appendChild(link);
        photoCard.appendChild(description);
        gallery.appendChild(photoCard);
      });

      lightbox.refresh();
      isLoading = false;
    } catch (error) {
      console.error('Error fetching images:', error);
      isLoading = false;
    }
  }

  function isScrollNearBottom() {
    return (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    );
  }

  window.addEventListener('scroll', () => {
    if (isScrollNearBottom() && !isLoading) {
      currentPage++;
      fetchImages(currentQuery, currentPage);
    }
  });
});
