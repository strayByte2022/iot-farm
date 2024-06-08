import React, { useEffect } from "react";
import { List, Page, Icon, useNavigate, Select, Button } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { userState } from "../state";

import UserCard from "../components/user-card";
import axios from "axios";
import { element } from "prop-types"; 

const HomePage: React.FunctionComponent = () => {
  const user = useRecoilValue(userState);
  const base_url = "http://127.0.0.1:5000/schedules"
  const navigate = useNavigate();
  const [sched, setSched] = React.useState("");
  const [currentSchedState, setCurrentSchedState] = React.useState(true)
  const [fetchedSched, setFetchedSched] = React.useState([])
  const { Option } = Select;
 
  const updateSchedule = async (state: boolean) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      "isActive": state
    });
    const requestOptions:Object = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try {
      await fetch(`http://127.0.0.1:5000/schedules/${sched}/active`,requestOptions )
      setCurrentSchedState(state)
    } catch (error) {
      console.log(error)
      return
    }

  }
  const handleActivateSchedule = () => {
    updateSchedule(true)
  }
  const handleDeactivateSchedule = () => {
    updateSchedule(false)
  }
  const handleSelectChange = (e: any) => {
    setSched(e)
    const temp: any = fetchedSched.filter((element: any) => element.schedulerName === e).pop()
    const activeState = temp?.isActive
    setCurrentSchedState(activeState)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(base_url)

        setFetchedSched(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <Page className="page">
      <div className="section-container">
        <UserCard user={user.userInfo} />
      </div>
      <div className="section-container">
        <Select label="Select scheduler" placeholder="--Select--" onChange={(e: any) => { handleSelectChange(e) }}>
          {fetchedSched.map((element: any, index) => (<Option key={index} title={element?.schedulerName.split("_").join(" ")} value={element?.schedulerName} />))}
        </Select>
        {!sched ? <></> : <div>
          <div>
            Number of cycles: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.cycle)}
          </div>
          <div>
            Ferterlizer 1 duration: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.flow1)}
          </div>
          <div>
            Ferterlizer 2 duration: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.flow2)}
          </div>
          <div>
            Ferterlizer 3 duration: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.flow3)}
          </div>
          <div>
            Start time: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.startTime)}
          </div>
          <div>
            End time: {fetchedSched.filter((element: any) => element.schedulerName === sched).map((element: any) => element.stopTime)}
          </div>
        </div>}
        <Button disabled={currentSchedState} onClick={()=>{handleActivateSchedule()}}>Activate</Button>
        <Button type="danger" disabled={!currentSchedState} onClick={()=>{handleDeactivateSchedule()}} >Deactivate</Button>
      </div>

    </Page>
  );
};

export default HomePage;
