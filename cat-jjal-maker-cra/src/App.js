import React from "react";
import "./App.css";
import Title from "./components/Title";
import Form from "./components/Form";
import MainCard from "./components/MainCard";
import Favorites from "./components/Favorites";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const App = () => {
  const CAT1 =
    "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg";
  const CAT2 =
    "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_960_720.jpg";
  const CAT3 =
    "https://cdn.pixabay.com/photo/2017/11/14/13/06/kitty-2948404__340.jpg";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter"); // 원하는 초기값을 리턴
  });
  const [mainCatImg, setMainCatImg] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const isInFavorites = favorites.includes(mainCatImg);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCatImg(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  const updateMainCat = async (value) => {
    const newCat = await fetchCat(value);
    setMainCatImg(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  };

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCatImg];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  return (
    <div className="App">
      <Title>
        {counter ? counter + "번째 고양이 가라사대" : "고양이 가라사대"}
      </Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCatImg}
        onHeartClick={handleHeartClick}
        isInFavorites={isInFavorites}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
