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
import AssignedProfile from "./AssignedProfile";

import LinearProgress from "@mui/material/LinearProgress";

const CreateSteps = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const getPID = useSelector((state) => state.myReducer.projectID);
  const getPPID = useSelector((state) => state.myReducer.personalID);
  //   const getTask = useSelector((state) => state.myReducer.taskID);

  const [saveMyID, setSaveMyID] = useState(dispatch(getTaskID(id)));
  console.log(getPID);
  const { currentUser } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [steps, setSteps] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [myTeam, setMyTeam] = useState([{ staff: "" }]);

  const [rate, setRate] = useState(0);
  const [total, setTotal] = useState(0);

  const [presentUser, setPresentUser] = useState([]);
  const [project, setProject] = useState([]);

  const onToggle = () => {
    setToggle(!toggle);
  };

  const createdWrokStation = async () => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(getPPID)
      .collection("task")
      .doc(id)
      .collection("steps")
      .doc()
      .set({
        steps,
        confirm: false,
        createdBy: currentUser?.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setSteps("");
  };

  const updateSteps = async (myID) => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(getPPID)
      .collection("task")
      .doc(id)
      .collection("steps")
      .doc(myID)
      .update({
        confirm: true,
      });
    setSteps("");
  };

  const viewWrokStation = async () => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(getPPID)
      .collection("task")
      .doc(id)
      .collection("steps")
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

  const getDone = () => {
    let checked = project.filter((el) => el.confirm === true).length;
    setRate(checked);
    setTotal(project.length);
  };

  useEffect(() => {
    viewWrokStation();
    viewUser();
    getDone();
    console.log(rate, total);
  }, [rate]);

  return (
    <Container>
      <Wrapper>
        <Text fs>
          Welcome back, <span>{presentUser?.userName}</span>
        </Text>
        <Text>
          You have assigned <strong>{project.length}</strong> STEPS to your Task
        </Text>
        <br />

        {currentUser ? (
          <Button onClick={onToggle}>Create how to inend to finish up!</Button>
        ) : null}

        {toggle ? (
          <Holder>
            <br />
            <Input
              placeholder="Map your Steps"
              value={steps}
              onChange={(e) => {
                setSteps(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                createdWrokStation();
                setToggle(false);
              }}
            >
              Assigned
            </Button>
          </Holder>
        ) : null}

        <br />
        <br />
        <div>
          {
            <Rating
              onClick={() => {
                const checked = project.filter(
                  (el) => el.confirm === true
                ).length;
                const totalRate = project.length;
                console.log((checked / totalRate) * 100);
              }}
            >
              <LinearProgress
                variant="determinate"
                value={
                  (project.filter((el) => el.confirm === true).length /
                    project.length) *
                  100
                }
              />
              {Math.ceil(
                (project.filter((el) => el.confirm === true).length /
                  project.length) *
                  100
              )}
              %
            </Rating>
          }
        </div>

        {project?.map((props) => (
          <Div key={props.id}>
            <br />

            {props.confirm ? (
              <Box type="checkbox" checked />
            ) : (
              <Box type="checkbox" />
            )}
            <Text>{props.steps} </Text>
          </Div>
        ))}
        <br />
        <Button1
          to={`/review`}
          onClick={() => {
            console.log("Hello", saveMyID);
            // updateSteps(props.id);
          }}
        >
          View and Update your Status
        </Button1>
      </Wrapper>
    </Container>
  );
};

export default CreateSteps;

const Rating = styled.div`
  width: 200px;
`;
const Box = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;
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
  margin: 5px 0;

  ::placeholder {
    font-family: Poppins;
  }
`;

const Button1 = styled(Link)`
  text-decoration: none;
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  font-size: ${({ fs }) => (fs ? "30px" : "15px")};
  min-width: 300px;
  /* text-align: center; */
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
