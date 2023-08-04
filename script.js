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
      resetValues()
      clearContainer()
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
      resetValues()
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
      arrayOfMobiles.forEach((mobile) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = mobile.image;

        const mobileName = document.createElement("p");
        mobileName.innerText = mobile.phone_name;

        card.appendChild(image);
        card.appendChild(mobileName);

        mainContainer.appendChild(card);
      });
    }
  }
});
