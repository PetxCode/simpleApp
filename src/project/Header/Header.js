import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import { AuthContext } from "../Global/AuthProvider";
import { app } from "../../base";

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Contain>
      <Wrapper>
        <Logo />
        <Navigation>
          <Nav to="/workSpace">
            <Icon>
              <LocalGasStationIcon />
            </Icon>
            <span>My WorkSpaces</span>
          </Nav>

          <Nav1>
            <span>{currentUser?.uid}</span>
          </Nav1>
        </Navigation>

        <Holder>
          <Nav to="/personal">
            <Icon>
              <AccountTreeIcon />
            </Icon>
            <span>My Projects</span>
          </Nav>
          {currentUser ? (
            <Nav1
              omnClick={() => {
                app.auth().signOut(0);
              }}
            >
              <Icon>
                <SensorDoorIcon />
              </Icon>
              <span>LogOut</span>
            </Nav1>
          ) : (
            <Nav to="/register">
              <Icon>
                <MeetingRoomIcon />
              </Icon>
              <span>Login</span>
            </Nav>
          )}
        </Holder>
      </Wrapper>
    </Contain>
  );
};

export default Header;

const Holder = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin: 0 5px;
`;

const Nav1 = styled.div`
  text-decoration: none;
  color: white;
  margin: 0 5px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  transition: all 350ms;

  &.active {
    background-color: rgba(255, 255, 255, 0.4);
  }

  padding: 15px 20px;
  :hover {
    background-color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
  }
`;

const Nav = styled(NavLink)`
  text-decoration: none;
  color: white;
  margin: 0 5px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  transition: all 350ms;

  &.active {
    background-color: rgba(255, 255, 255, 0.4);
  }

  padding: 15px 20px;
  :hover {
    background-color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
  }
`;

const Navigation = styled.div`
  display: flex;
  flex: 1;
`;

const Logo = styled.img`
  margin: 0 20px;
  width: 200px;
  height: 50px;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const Contain = styled.div`
  width: 100%;
  height: 100px;
  background-color: #004080;
  color: white;
`;
