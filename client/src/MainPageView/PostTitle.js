import axios from 'axios';
import { useState, useEffect } from 'react';
import { FiEdit2, FiCornerDownLeft } from 'react-icons/fi';

function PostTitle({ nick, setNick, clickedDay, date, testFlag, googleId }) {
  const [defaultTitle, setDefaultTitle] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const [editFlag, setEditFlag] = useState(false);
  const [editBtn, setEditBtn] = useState(false); // 나중에 본인페이지, 오늘날짜에만 버튼 나오도록 설정

  useEffect(async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/nickname?googleId=${googleId}`,
    );
    setNick(data.data.nickname);
  }, []);

  useEffect(async () => {
    try {
      if (testFlag === true) {
        // test api
        const { data } = await axios.get(
          `http://localhost:8000/title?id=${nick}&date=${clickedDay.getDate()}`,
        );
        setDefaultTitle(data[0].title);
        setTitle(defaultTitle);
        console.log(data[0]);
      } else if (nick) {
        // 본 api
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/titles/${nick}?date=${date}`,
        );
        console.log(data);
        setDefaultTitle(data.data.title);
        setTitle(data.data.title);
      }
    } catch (e) {
      console.log(e.message);
      setDefaultTitle(`${nick}의 이유식일기`);
      setTitle(defaultTitle);
    }
    // 맨 처음엔 data를 못받아오고, 다시 리로드되어서 받아오는데 본 요청때는 체크해봐야할듯 함
  }, [nick, clickedDay, editFlag]);

  const editTitle = () => {
    if (title.length < 3 || title.length > 16) {
      alert('3자 이상 15자 이하로 입력해주세요');
      return;
    }
    if (editFlag === true) {
      if (testFlag === true) {
        setDefaultTitle(title);
        axios.patch(`http://localhost:8000/title/dhyeon`, { title });
      } else {
        setDefaultTitle(title);
        const data = axios.post(
          `${process.env.REACT_APP_API_URL}/titles/${nick}`,
          {
            googleId,
            title,
          },
        );
        console.log(data);
      }
    }
    setEditFlag(!editFlag);
  };

  const onChangeTitle = e => {
    setTitle(e.target.value);
  };

  return (
    <>
      {editFlag === false ? (
        <>
          <span className="title-content">{defaultTitle}</span>
          <FiEdit2 className="title-edit-btn" onClick={editTitle} />
        </>
      ) : (
        <>
          <input
            autoFocus
            className="title-content-input"
            type="text"
            value={title}
            onChange={onChangeTitle}
          ></input>
          <FiCornerDownLeft className="title-edit-btn" onClick={editTitle} />
        </>
      )}
    </>
  );
}

export default PostTitle;
