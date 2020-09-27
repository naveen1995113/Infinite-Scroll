const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad=true;

//Unsplash API
let initialCount = 5;
const apiKey = `aMK2hs7fQVF7xAh9Zmvnr3x-WGsz--xisQGifeVkBeM`;
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialCount}`;
//Load the remaining images by changing the value of inital count of Images from 5 to 30
function updateAPIURLWithNewCount(imgCount){
    initialImagesLoaded=30;
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imgCount}`;

}

//Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//Create Elemetns for Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    //Create <a> to link to Unspalsh
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    //Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    //Create <div> for userdetails
    const userContainer = document.createElement("div");
    setAttributes(userContainer, {
      class: "user-container",
    });

    //Create <div> for userName
    const userName = document.createElement("strong");
    if (photo.user.name === "" || photo.user.name === null) {
      userName.innerText = "Captured by: Unknown";
    } else {
      userName.innerText = `Captured by: ${photo.user.name}`;
    }

    //Event to check imageloader
    img.addEventListener("load", imageLoaded);

    //Put <img> and <div> inside <a>, then put both inside imageContainer element
    userContainer.appendChild(userName);
    item.appendChild(img);
    item.appendChild(userContainer);
    imageContainer.appendChild(item);
  });
}

//Get photos from API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      photosArray = await response.json();
      displayPhotos();
      if(isInitialLoad){
          updateAPIURLWithNewCount(30);
          isInitialLoad=false;
      }
    } else {
      alert("HTTP-Error: " + response.status);
    }
  } catch (error) {
    console.log(error);
  }
}

//Check to see if scrolling near bottom of page, Load more Photos
window.addEventListener("scroll", () => {
  if (
    (window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000) &
    ready
  ) {
    ready = false;
    getPhotos();
  }
});
//On Load
getPhotos();
