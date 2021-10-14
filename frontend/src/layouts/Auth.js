import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

// components

import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

// views

import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";


export default function Auth() {

  const history = useHistory()

  // useEffect hook replaces componentDidMount, componentDidUpdate and componentWillUnmount
  // https://reactjs.org/docs/hooks-effect.html
  /* To run the hook only once we can use the second argument to useEffect — an array of values 
      that the effect depends on. By default, the effect will run when any of the props or state 
      changes. If we pass an empty array, the effect will only run on first render.
  */
  useEffect(() => {
    // TODO: https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
    const token = sessionStorage.getItem('authToken')
    console.log('authToken:Auth', token)
    if (token) history.push('/admin')
  }, [])

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
