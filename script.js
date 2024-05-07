const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

const getRandomObjectFromArray = array => {
    return array[Math.floor(Math.random() * array.length)];
}
let validObjectIds;

const getAllObjects = async () => {
    const response = await fetch(API_URL);
    const objects = await response.json();
    console.log(objects)
    validObjectIds = objects.objectIDs;
    const gottenObject = getOneObject();

    return objects.objectIDs;
}

const pickRandFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}
const attemptedIDs = localStorage.getItem('failedIdAttempts') || '[]';
console.log(attemptedIDs)
const parsedAttemptedIDs = JSON.parse(attemptedIDs);

const getOneObject = async () => {
    let randomID = pickRandFromArray(validObjectIds)

    if (!parsedAttemptedIDs.includes(randomID)) {
        const response = await fetch(`${API_URL}/${randomID}`);
        const object = await response.json();
        console.log(object)
        if (object.primaryImageSmall || object.primaryImage) {
            console.log('ID found that does work')
            setStoredObjects(object)
            paintArtworkOnPage(object)
        } else {
        console.log('ID found that does not work')
        parsedAttemptedIDs.push(randomID);
        const stringyAttempts = JSON.stringify(parsedAttemptedIDs);
        localStorage.setItem('failedIdAttempts', stringyAttempts)
        getOneObject();
        }
    } else {
    console.log('ID used that is already in failed attempts')
    getOneObject();
    }
}

const getStoredObjects = () => {
    const value = localStorage.getItem('storedObjects');
    return JSON.parse(value)
}

const setStoredObjects = (object) => {
    let currentStoredObjects = localStorage.getItem('storedObjects');
    let parsedCurrent = JSON.parse(currentStoredObjects);
    console.log(parsedCurrent)
    if (parsedCurrent) {
        parsedCurrent.push(object)
    } else {
        parsedCurrent = [];
    }
    const stringified = JSON.stringify(parsedCurrent)
    localStorage.setItem('storedObjects', stringified);
}

document.addEventListener("DOMContentLoaded", () => {
    getAllObjects();
});


async function fetchValidObjectWithImage() {
    const objectIDs = await getAllObjects();
    for (let id of objectIDs) {
        const object = await getOneObject(id);
        if (object) {
            console.log(object);
            paintArtworkOnPage(object);
            setStoredObjectID(object.objectID);
            localStorage.setItem('storedDate', new Date().toDateString());
            return;
        }
    }
    console.error("No objects with valid images found.");
}

function getRandomValue (min, max) {
    return Math.random() * (max - min) + min;
}

const paintArtworkOnPage = (item) => {
    const artWorkContainer = document.querySelector(".canvas");
    const currentArtWrapper = document.createElement('div')
    const randomTop = getRandomValue(0, window.innerHeight - 50)
    const randomLeft = getRandomValue(0, window.innerWidth - 50)
    artWorkContainer.appendChild(currentArtWrapper)

    const noSpaceTitle = item.title.replace(/\s+/g,'');
    currentArtWrapper.id = noSpaceTitle;
    currentArtWrapper.setAttribute('draggable', true);
    currentArtWrapper.classList.add('art-wrapper')
    currentArtWrapper.style.position = 'absolute';
    currentArtWrapper.style.left = getRandomValue(0, window.innerWidth) + 'px';
    currentArtWrapper.style.top = getRandomValue(0, window.innerHeight) + 'px';

    let usedImgSrc = item.primaryImageSmall

    if (usedImgSrc) {
        usedImgSrc = item.primaryImage;
    }

    currentArtWrapper.innerHTML = `
        <div class = "imageWrapper">
            <img class="art-image" src="${usedImgSrc}" alt="${item.title}" crossOrigin="anonymous"/>
        </div>
        <div class="info">
            <p class="title">${item.title}</p>
            <p class="artist">${item.artistDisplayName}</p>
            <p class="date">${item.objectDate}</p>
            <p class="country">${item.country}</p>
        </div>`;

        const transferArray = ['artwork', noSpaceTitle];
        const stringyTransfer = JSON.stringify(transferArray);
        currentArtWrapper.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", stringyTransfer);
        currentArtWrapper.classList.add("dragging"); // Add dragging class when dragging starts
    });

    currentArtWrapper.addEventListener("dragend", () => {
        currentArtWrapper.classList.remove("dragging"); // Remove dragging class when dragging ends
    });
};

const drawAllStoredObjects = () => {
    const allStoredObjects = getStoredObjects().reverse();
    console.log(allStoredObjects)
    if (allStoredObjects) {
        allStoredObjects.forEach((object, index) => {
            if (index <= 20) {
                paintArtworkOnPage(object);
            }
        })
    }
}

drawAllStoredObjects();

document.addEventListener("DOMContentLoaded", () => {
    const artSection = document.querySelector(".art");

    artSection.addEventListener("dragover", (event) => {
        event.preventDefault(); 
    });

    artSection.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const parsedTransferData = JSON.parse(data);
        if (parsedTransferData[0] === "artwork") {
            const desiredArtWrapper = document.getElementById(parsedTransferData[1]);
            artSection.appendChild(desiredArtWrapper); 
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const updateStyles = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const h1Element = document.getElementById("clickableH1");
        const navElement = document.querySelector(".nav");
        const aboutElement = document.querySelector(".about button");
        const archiveElement = document.querySelector(".archive button");
        const timerElement = document.querySelector(".timer");

        if (currentHour >= 17 || currentHour < 10) { 
            document.body.style.backgroundColor = "#121212"; 
            h1Element.style.color = "#f4e9bb"; 
            navElement.style.color = "#f4e9bb"; 
            aboutElement.style.color = "#f4e9bb"; 
            archiveElement.style.color = "#f4e9bb"; 
            timerElement.style.color = "#f4e9bb";
        } else {
            document.body.style.backgroundColor = "#f4e9bb"; 
            h1Element.style.color = "#121212"; 
            navElement.style.color = "#121212"; 
            aboutElement.style.color = "#121212"; 
            archiveElement.style.color = "#121212"; 
            timerElement.style.color = "#121212"; 
        }
    };

    updateStyles();

    setInterval(updateStyles, 60000); 
});

document.addEventListener('DOMContentLoaded', function() {
    var timerInterval = setInterval(function() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        function pad(n) {
            return (n < 10 ? "0" : "") + n;
        }

        document.getElementById('timerContainer').textContent = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }, 1000);
});

var $btn = document.getElementById('printButton');
$btn.addEventListener('mousedown', onScreenShotClick);

function download( canvas, filename ) {
	// create an "off-screen" anchor tag
	const a = document.createElement('a');

	// the key here is to set the download attribute of the a tag
	a.download = filename;

	// convert canvas content to data-uri for link. When download
	// attribute is set the content pointed to by link will be
	// pushed as "download" in HTML5 capable browsers
	a.href = canvas.toDataURL("image/png;base64");

	a.style.display = 'none';
	document.body.appendChild( a );
	a.click();
	document.body.removeChild( a );
}

function onScreenShotClick(event){
    const element = document.getElementById('art-to-capture')

    var printButton = document.getElementById('printButton');
    printButton.style.opacity = "0";

    html2canvas(element, { useCORS: true}).then( ( canvas ) => {
        const imageData = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = imageData;
        downloadLink.download = 'snapshot.png'

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink)
        download(canvas, 'screenshot' );
    });

    setTimeout(()=>{
        printButton.style.opacity = "1";
    }, 1000)
}

document.addEventListener("DOMContentLoaded", () => {
    const artDiv = document.querySelector(".art");

    // Set initial state
    artDiv.classList.add("collapsed"); // Start collapsed

    artDiv.addEventListener("click", (event) => {
        if (event.target.nodeName !== 'BUTTON') {
            if (artDiv.classList.contains("collapsed")) {
                artDiv.classList.remove("collapsed");
                artDiv.classList.add("expanded");
            } else {
                artDiv.classList.remove("expanded");
                artDiv.classList.add("collapsed");
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const aboutBtn = document.getElementById("aboutBtn");
    const aboutBox = document.getElementById("aboutBox");

    aboutBtn.addEventListener("click", () => {
        aboutBox.classList.toggle("hidden"); // Toggle the "hidden" class on click
    });
});