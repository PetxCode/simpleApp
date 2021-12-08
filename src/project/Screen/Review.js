import React, { useState, useEffect, useContent, useContext } from "react";
import styled from "styled-components";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { app } from "../../base";
import { AuthContext } from "../Global/AuthProvider";
import firebase from "firebase";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPersonalID, getTaskID } from "../Global/Redux";
import AssignedProfile from "./AssignedProfile";

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getPID = useSelector((state) => state.myReducer.projectID);
  const getPPID = useSelector((state) => state.myReducer.personalID);
  const getTask = useSelector((state) => state.myReducer.taskID);

  console.log(getPID, getPPID, getTask);
  const { currentUser } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [steps, setSteps] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [myTeam, setMyTeam] = useState([{ staff: "" }]);

  const [presentUser, setPresentUser] = useState([]);
  const [project, setProject] = useState([]);

  const [onConfirm, setOnConfirm] = useState(false);

  const onToggle = () => {
    setToggle(!toggle);
  };

  const createdWrokStation = async (id) => {
    await app
      .firestore()
      .collection("workstation")
      .doc(getPID)
      .collection("project")
      .doc(getPPID)
      .collection("task")
      .doc(getTask)
      .collection("steps")
      .doc(id)
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
      .doc(getTask)
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
          You have assigned <strong>{project.length}</strong> STEPS to your Task
        </Text>
        <br />
        {/* 
        {currentUser ? (
          <Button onClick={onToggle}>Create how to inend to finish up!</Button>
        ) : null} */}

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

        {project?.map((props, i) => (
          <Div key={props.id}>
            {props.confirm ? (
              <Box type="checkbox" checked />
            ) : (
              <Box
                type="checkbox"
                disabled
                value={onConfirm}
                onChange={(e) => {
                  setOnConfirm(true);
                }}
              />
            )}
            <Text>{props.steps} </Text>
            {props.confirm ? (
              <Button11>Good Job</Button11>
            ) : (
              <Button11
                onClick={() => {
                  createdWrokStation(props.id);
                  console.log(props.id);
                  console.log(i);
                }}
              >
                Done
              </Button11>
            )}
          </Div>
        ))}
        <br />
        <Button
          onClick={() => {
            navigate(-1);
            console.log(onConfirm);
            console.log("Heeloooo", id);
          }}
        >
          Okay for Now
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Review;

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

const Button11 = styled.button`
  text-decoration: none;
  padding: 10px 30px;
  color: white;
  background-color: #004080;
  transform: scale(1);
  transition: all 350ms;

  :hover {
    transform: scale(0.97);
    cursor: pointer;
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
