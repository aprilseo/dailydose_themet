const getStoredObjects = () => {
    const value = localStorage.getItem('storedObjects');
    return JSON.parse(value)
}

function getRandomValue (min, max) {
    return Math.random() * (max - min) + min;
}

const paintArtworkOnPage = (item) => {
    const gridContainer = document.querySelector(".archive-container");
    
    const randomTop = getRandomValue(50, window.innerHeight - 50)
    const randomLeft = getRandomValue(50, window.innerWidth - 50)

    gridContainer.innerHTML += `
    <div class="archive-item">
        <div class = "imageWrapper">
            <img class="art-image" src="${item.primaryImageSmall}" alt="${item.title}"/>
        </div>
        <div class="info">
            <p class="title">${item.title}</p>
            <p class="artist">${item.artistDisplayName}</p>
            <p class="date">${item.objectDate}</p>
            <p class="country">${item.country}</p>
        </div>
    </div>`;
};

const drawAllStoredObjects = () => {
    const allStoredObjects = getStoredObjects();
    console.log(allStoredObjects)
    if (allStoredObjects) {
        allStoredObjects.forEach((object) => {
            paintArtworkOnPage(object);
        })
    }
}

drawAllStoredObjects();