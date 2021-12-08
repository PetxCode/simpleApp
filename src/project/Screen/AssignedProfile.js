import React, { useContext } from "react";
import styled from "styled-components";
import { app } from "../../base";
import { AuthContext } from "../Global/AuthProvider";

const AssignedProfile = ({ image, name, team }) => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = React.useState([]);
  console.log(team);
  const viewUser = async () => {
    await app
      .firestore()
      .collection("users")
      .doc(team)
      .get()
      .then((user) => {
        setUserData(user.data());
      });
  };

  React.useEffect(() => {
    viewUser();
  }, []);

  return (
    <Container>
      <Wrapper>
        {image ? <Img src={userData?.avatar} /> : null}
        <Card>
          {name ? (
            <div>
              {currentUser.uid === team ? (
                <Card1>You</Card1>
              ) : (
                userData?.userName
              )}
            </div>
          ) : null}
        </Card>
      </Wrapper>
    </Container>
  );
};

export default AssignedProfile;

const Img = styled.img`
  object-fit: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid black;
`;
const Card1 = styled.div`
  font-weight: bold;
`;
const Card = styled.div`
  margin: 0;
  font-weight: bold;
`;
const Wrapper = styled.div``;
const Container = styled.div``;
