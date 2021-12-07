import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { app } from "../../base";
import firebase from "firebase";
import LinearProgress from "@mui/material/LinearProgress";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState("");
  const [avatar, setAvatar] = useState("");

  const [percentage, setPercentage] = useState(0);

  const onUploadImage = async (e) => {
    const file = e.target.files[0];
    const save = URL.createObjectURL(file);
    setImage(save);

    const fileRef = await app.storage().ref();
    const storageRef = fileRef.child("users/" + file.name).put(file);

    storageRef.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const counter = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentage(counter);
        console.log(counter);
      },
      (err) => console.log(err.message),
      () => {
        storageRef.snapshot.ref.getDownloadURL().then((URL) => {
          console.log(URL);
          setAvatar(URL);
        });
      }
    );
  };

  const registerUser = async () => {
    const newUser = await app
      .auth()
      .createUserWithEmailAndPassword(email, password);

    if (newUser) {
      await app.firestore().collection("users").doc(newUser.user.uid).set({
        user: newUser.user.uid,
        userName,
        avatar,
        email,
        password,
      });
    }

    setUserName("");
    setEmail("");
    setPassword("");
  };

  return (
    <Container>
      <Wrapper>
        <Text>Register</Text>
        <Card>
          <Image src={image} />

          <ImageLabel htmlFor="pix">Upload an Image</ImageLabel>
          <Hold>
            {" "}
            {percentage > 0 && percentage < 99.9999 ? (
              <LinearProgress variant="determinate" value={percentage} />
            ) : null}
          </Hold>
          <ImageInput
            placeholder="image"
            type="file"
            id="pix"
            onChange={onUploadImage}
          />
          <br />
          <br />
          <Input
            placeholder="UserName"
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Input
            placeholder="UserName"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="UserName"
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <br />
          <Button onClick={registerUser}>Register</Button>
        </Card>

        <Text>
          Already have an acccount, <Span to="/signIn">Login Here</Span>
        </Text>
      </Wrapper>
    </Container>
  );
};

export default Register;

const Hold = styled.div`
  width: 200px;
  margin-top: 10px;
`;
const Span = styled(Link)`
  color: red;
  text-decoration: none;
`;

const Button = styled.div`
  padding: 15px 30px;
  background-color: #004080;
  color: white;
  border-radius: 3px;
  transition: all 350ms;
  transform: scale(1);

  :hover {
    transform: scale(1.03);
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  outline: none;
  border: 1px solid gray;
  background-color: transparent;
  border-radius: 3px;
  margin: 5px 0;
  padding-left: 10px;

  ::placeholder {
    font-family: Poppins;
  }
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageLabel = styled.label`
  padding: 10px 20px;
  background-color: #004080;
  color: white;
  border-radius: 30px;
  transition: all 350ms;
  transform: scale(1);

  :hover {
    transform: scale(0.97);
    cursor: pointer;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid black;
  margin: 10px 0;
  object-fit: cover;
`;

const Card = styled.div`
  padding-bottom: 30px;
  min-width: 500px;
  min-height: 300px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

const Text = styled.div`
  margin-bottom: 50px;
  margin: 20px 0;

  span {
    color: red;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  background-color: lightgray;
`;
