document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".search-container .search-btn");
  const searchBox = document.querySelector(".search-container .search-box");
  const errorMessage = document.getElementById("error-message");
  const mainContainer = document.querySelector(".container");
  const loadingAnimation = document.querySelector(".loading-container");
  const nothingFound = document.querySelector(".nothing-found");
  const buttonContainer = document.querySelector(".button-container");
  const showAllButton = document.querySelector(".button-container button");
  let allMobileData = [];
  let firstPortion = [];
  let restPortion = [];

  searchBox.addEventListener("keyup", startApi);
  searchButton.addEventListener("click", startApi);

  const clearContainer = () => {
    while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
    }
  };

  const resetValues = () => {
    allMobileData = [];
    firstPortion = [];
    restPortion = [];
  };

  function startApi() {
    const searchKey = searchBox.value;
    if (searchKey === "") {
      clearContainer()
      resetValues()
      buttonContainer.style.visibility = "hidden";
      errorMessage.style.display = "block";
      return;
    }
    errorMessage.style.display = "none";
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchKey}`;
    callApi(url);
  }

  const callApi = (url) => {
    loadingAnimation.style.visibility = "visible";
    setTimeout(() => {
      resetValues();
      fetch(url)
        .then((response) => response.json())
        .then((mobiles) => {
          loadingAnimation.style.visibility = "hidden";
          allMobileData = [...mobiles.data];
          processMobiles();
        });
    }, 300);
  };

  function processMobiles() {
    if (allMobileData.length === 0) {
      buttonContainer.style.visibility = "hidden";
      nothingFound.style.visibility = "visible";
      clearContainer()
      return;
    }

    if (allMobileData.length > 10) {
      buttonContainer.style.visibility = "visible";
      firstPortion = allMobileData.slice(0, 10);
      restPortion = allMobileData.slice(10, allMobileData.length);

      printElements(firstPortion);
    } else {
      buttonContainer.style.visibility = "hidden";
      printElements(allMobileData);
    }

    showAllButton.addEventListener("click", () => {
      buttonContainer.style.visibility = "hidden";
      printElements(allMobileData);
    });
    
    function printElements(arrayOfMobiles) {
      clearContainer();
      nothingFound.style.visibility = "hidden";
      arrayOfMobiles.forEach((mobile, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <img src="${mobile.image}">
        <p>${mobile.phone_name}</p>
        <button onclick="call('${mobile.phone_name}', '${mobile.image}')"  class="btn bg-warning" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Expand</button>
        `;
        setTimeout(()=>{
          card.classList.add("animate");
        },index*100)
        mainContainer.appendChild(card);
      });
    }
  }
});
function call(name, image){
  document.querySelector(".modal-title").innerText=name
  document.querySelector(".modal-body img").src=image
}

