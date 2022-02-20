import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import "../styles/Header.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setList } from "../actions/index";
import { reset } from "../actions/index";

import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

const WhiteTextField = withStyles({
  root: {
    "& fieldset": {
      borderColor: "#fff",
      "&$focused": {
        borderColor: "black",
      },
    },
  },
})((props) => (
  <TextField inputProps={{ style: { color: "white" } }} {...props} />
));

function Header() {
  const dispatch = useDispatch();
  const [txt, setTxt] = useState("");
  let [searchtxt, setSearchTxt] = useState("");
  const [nodatafound, setNoDatafound] = useState(false);
  const [list, setL] = useState("");
  let pageNum = useSelector((state) => state.load);
  const listCard = useSelector((state) => state.cardList);
  const apiUrl = "https://api.jikan.moe/v3/search/anime?q=";
  const getCards = () => {
    console.log(searchtxt);
    if (!!searchtxt)
      axios
        .get(`${apiUrl}${searchtxt}&limit=5&page=${pageNum}`)
        .then((res) => {
          if (res.data.total === 0);
          else {
            console.log(res);
            let tmpList = [...(pageNum === 1 ? [] : listCard)];
            res.data.results.map(
              (item) =>
              (tmpList = [
                ...tmpList,
                [item.image_url, item.title, item.mal_id],
              ])
            );
            setL(tmpList);
            dispatch(setList([...tmpList]));
          }
          setNoDatafound(false);
        })
        .catch((err) => {
          console.log(err);
          setNoDatafound(true);
          setL([]);
          dispatch(setList([]));
        });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    searchtxt = txt;
    setSearchTxt(searchtxt);
    window.scrollTo(0, 0);
    dispatch(reset());
    pageNum = 1;
    getCards();
    setTxt("");
  };
  useEffect(() => {
    if (pageNum !== 1) getCards();
  }, [pageNum]);

  return (
    <div className="header">
      <form noValidate onSubmit={handleSubmit}>
        <WhiteTextField
          className="searchinput"
          variant="outlined"
          placeholder="Search Any Anime"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <p
                  onClick={handleSubmit}
                  style={{ color: "#fff", cursor: "pointer" }}
                >
                  Go
                </p>
              </InputAdornment>
            ),
          }}
        />
      </form>
      {nodatafound ? (
        <p className="searchDetails">
          No Data Found
        </p>
      ) : (
        <p className="searchDetails">
          Requesting:{apiUrl}${searchtxt}
        </p>
      )}
    </div>
  );
}

export default Header;
