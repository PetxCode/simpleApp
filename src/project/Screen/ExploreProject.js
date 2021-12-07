import React, { useState, useEffect, useContent, useContext } from "react";
import styled from "styled-components";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { app } from "../../base";
import { AuthContext } from "../Global/AuthProvider";
import firebase from "firebase";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPersonalID, getTaskID } from "../Global/Redux";

const ExploreProject = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const getPID = useSelector((state) => state.myReducer.projectID);

  const [exID, setExID] = useState(dispatch(getTaskID(id)));

  console.log(getPID);
  const { currentUser } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("");

  const [myTeam, setMyTeam] = useState([{ staff: "" }]);

  const [presentUser, setPresentUser] = useState([]);
  const [project, setProject] = useState([]);

  const onToggle = () => {
    setToggle(!toggle);
  };

  const addStaff = () => {
    setMyTeam([...myTeam, { staff: "" }]);
  };

  const onChangeStaff = (i, e) => {
    const values = [...myTeam];
    values[i][e.target.name] = e.target.value;
    setMyTeam(values);
  };

  const removeStaff = (i, e) => {
    const values = [...myTeam];
    values.splice(i, 1);
    setMyTeam(values);
  };

  const createdWrokStation = async () => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(exID)
      .collection("task")
      .doc()
      .set({
        name,
        createdBy: currentUser?.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  const viewWrokStation = async () => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(id)
      .collection("task")
      .onSnapshot((snapshot) => {
        const r = [];
        snapshot.forEach((doc) => {
          r.push({ ...doc.data(), id: doc.id });
        });
        setProject(r);
      });
  };

  const viewUser = async () => {
    await app
      .firestore()
      .collection("users")
      .doc(currentUser?.uid)
      .get()
      .then((user) => {
        setPresentUser(user.data());
      });
  };

  useEffect(() => {
    viewWrokStation();
    viewUser();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Text fs>
          Welcome back, <span>{presentUser?.userName}</span>
        </Text>
        <Text>
          You have assigned <strong>{project.length}</strong> Task to your staff
        </Text>
        <br />

        {currentUser ? (
          <Button onClick={onToggle}>
            Have any Project in Mind, Start Here
          </Button>
        ) : null}

        {toggle ? (
          <Holder>
            <br />
            <Input
              placeholder="Name your new Work Station"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <br />
            <br />
            {myTeam.map((props, i) => (
              <Hold key={i}>
                <Icon onClick={addStaff}>
                  <AddBoxIcon />
                </Icon>
                <Icon bg onClick={removeStaff}>
                  <IndeterminateCheckBoxIcon />
                </Icon>
                <InputState
                  placeholder="Enter your Team: "
                  name="staff"
                  value={props.staff}
                  onChange={(e) => {
                    onChangeStaff(i, e);
                  }}
                />
              </Hold>
            ))}

            <Button
              onClick={() => {
                createdWrokStation();
                setToggle(false);
              }}
            >
              Created
            </Button>
          </Holder>
        ) : null}

        <br />
        <br />
        <CardHolder>
          {project?.map((props) => (
            <Card key={props.id}>
              <Text fs>{props.name} </Text>
              {currentUser.uid === props.createdBy ? null : (
                <Button1 to="/">Explore This Project</Button1>
              )}
            </Card>
          ))}
        </CardHolder>
      </Wrapper>
    </Container>
  );
};

export default ExploreProject;

const CardHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const Card = styled.div`
  margin: 10px;
  min-width: 300px;
  padding: 5px;
  height: 200px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputState = styled.input`
  width: 239px;
  height: 40px;
  outline: none;
  border: 1px solid gray;
  border-radius: 3px;
  padding-left: 10px;

  ::placeholder {
    font-family: Poppins;
  }
`;

const Icon = styled.div`
  color: ${({ bg }) => (bg ? "red" : "#004080")};
  margin: 0 3px;
`;

const Hold = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  outline: none;
  border: 1px solid gray;
  border-radius: 3px;
  padding-left: 10px;
  ::placeholder {
    font-family: Poppins;
  }
`;

const Button1 = styled(Link)`
  padding: 15px 30px;
  color: white;
  background-color: #004080;
  transform: scale(1);
  transition: all 350ms;

  :hover {
    transform: scale(0.97);
    cursor: pointer;
  }
`;

const Button = styled.div`
  padding: 15px 30px;
  color: white;
  background-color: #004080;
  transform: scale(1);
  transition: all 350ms;

  :hover {
    transform: scale(0.97);
    cursor: pointer;
  }
`;

const Holder = styled.div`
  margin: 20px 0;
`;

const Text = styled.div`
  font-size: ${({ fs }) => (fs ? "30px" : "18px")};

  span {
    text-transform: capitalize;
    font-weight: bold;
  }
`;

const Wrapper = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  padding-top: 50px;
`;

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 100px);
  height: 100%;
  background-color: lightgray;
`;
