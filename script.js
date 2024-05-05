const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

const getRandomObjectFromArray = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const getAllObjects = async () => {
    const response = await fetch(API_URL);
    const objects = await response.json();
    return objects.objectIDs;
}

const getOneObject = async (objectID) => {
    const response = await fetch(`${API_URL}/${objectID}`);
    const object = await response.json();
    if (object.primaryImageSmall !== "") {
        return object;
    }
    return null; // Skip objects without an image
}

const getStoredObjectID = () => {
    return localStorage.getItem('storedObjectID');
}

const setStoredObjectID = (objectID) => {
    localStorage.setItem('storedObjectID', objectID);
}

document.addEventListener("DOMContentLoaded", () => {
    const storedObjectID = getStoredObjectID();
    const currentDate = new Date().toDateString();
    const storedDate = localStorage.getItem('storedDate');
    const storedImage = localStorage.getItem('storedImage');

    if (storedDate === currentDate && storedObjectID) {
        getOneObject(storedObjectID).then((object) => {
            if (object) {
                console.log(object);
                paintArtworkOnPage(object);
            } else {
                console.log("Stored object has no image, fetching new object.");
                fetchValidObjectWithImage();
            }
        });
    } else {
        fetchValidObjectWithImage();
    }
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

const paintArtworkOnPage = (item) => {
    const artWorkContainer = document.querySelector(".canvas");
    artWorkContainer.innerHTML = `
    <div class="art-wrapper" draggable="true">
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

    const artWrapper = document.querySelector(".art-wrapper");

    artWrapper.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", "artwork");
        artWrapper.classList.add("dragging"); // Add dragging class when dragging starts
    });

    artWrapper.addEventListener("dragend", () => {
        artWrapper.classList.remove("dragging"); // Remove dragging class when dragging ends
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const artSection = document.querySelector(".art");

    artSection.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    artSection.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        if (data === "artwork") {
            const artWrapper = document.querySelector(".art-wrapper");
            artSection.appendChild(artWrapper);
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const artSection = document.querySelector(".art");

    artSection.addEventListener("dragover", (event) => {
        event.preventDefault(); 
    });

    artSection.addEventListener("drop", (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        if (data === "artwork") {
            const artWrapper = document.querySelector(".art-wrapper");
            artSection.appendChild(artWrapper); 
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const updateStyles = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const h1Element = document.getElementById("clickableH1");
        const navElement = document.querySelector(".nav");
        const aboutElement = document.querySelector(".about");
        const archiveElement = document.querySelector(".archive");
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
    const element = document.querySelector(".art");

    var printButton = document.getElementById('printButton');
    printButton.style.opacity = "0";

    html2canvas(element).then( ( canvas ) => {
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