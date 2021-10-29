import React, { useEffect, useRef, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import { BinsService } from "services/services";
import { UserService } from "services/services";
import { DataContext } from "context/DataContext";

export default function Admin() {

  const history = useHistory();
  const [binCount, setBinCount] = useState(-1);
  const [userCount, setUserCount] = useState(-1);
  const [userList, setUserList] = useState([]);
  const [binList, setBinList] = useState([]);

  /**
   * NOTE: a functional component does not have a render function, the component itself, with everything defined in it being 
   * the render function which returns a JSX in the end. 
   * Thus, when there is a re-render the whole code in the functional component is executed again and if we have variables 
   * inside it will be initialized again with the default value.
   */
  
  // let count = 0; // any time there is a re-render e.g. by updating state, this will reset to 0
  // let refCount = useRef(0); // gives the same ref object on every render; last value will be mainttained across re-render

  let binService = useRef();
  let userService = useRef();

  useEffect(() => {
    // TODO: https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
    const authToken = sessionStorage.getItem('authToken')
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!authToken || !userData) {
      history.push('/auth');
      return;
    }
    const { userId } = userData;
    binService.current = new BinsService(authToken, userId);
    userService.current = new UserService(authToken, userId);
    fetchData();
  }, [history])

  const fetchData = async () => {
    try {
      const res1 = await binService.current.getAllBins();
      const bins = res1.data;
      setBinCount(bins.length);
      setBinList(bins);
      const res2 = await userService.current.getAllUsers();
      const users = res2.data;
      setUserCount(users.length);
      setUserList(users);
    } catch (error) {
      console.error(error);
      alert('An error occurred fetching data');
    } 
  }

  return (
    <DataContext.Provider value={{userList, binList}}>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats binCount={binCount} userCount={userCount} />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </DataContext.Provider>
  );
}
