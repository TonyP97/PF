import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginGoogle, login, loginFacebook } from "../redux/actions";
import { useEffect } from "react";
import { GoogleLogin } from 'react-google-login';
import swal from "sweetalert";
import { gapi } from 'gapi-script';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientIdGoogle = process.env.REACT_APP_CLIENT_ID_GOOGLE;
  const clientIdFacebook = process.env.REACT_APP_CLIENT_ID_FACEBOOK;
  const [user, setUser] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    const initClient = () => {
      gapi.client.init({ clientIdGoogle: clientIdGoogle, scope: '' });
    };
    gapi.load('client:auth2', initClient);
  });


  const handleChange = (e) => {
    let { name, value } = e.target;
    let newDatos = { ...user, [name]: value };
    setUser(newDatos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      console.log("no enviar");
    } else {
      let data = await dispatch(login(user));
      if (data) {
        if (data.hasOwnProperty("message")) {
          swal({
            title: data.message,
            icon: "warning",
            button: "Aceptar",
          });
        } else {
          window.localStorage.setItem("user", data);
          navigate("/");
        }

      } else {
        swal({
          title: "Usuario o contraseña incorrectos",
          icon: "warning",
          button: "Aceptar",
        });
      }
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;

    const user = {
      user: result.name,
      email: result.email,
      photo: result.imageUrl,
      googleId: result.googleId,
    }
    let data = await dispatch(loginGoogle(user));
    window.localStorage.setItem('user', data.data);
    navigate('/');
  };

  const googleFailure = (err) => {
    console.log(err)
    swal({
      title: "Fallo inicio de sesión con google, intenta nuevamente!",
      icon: "warning",
      button: "Aceptar",
    });
  };
  
  const responseFacebook = () => {
    if(!window.FB)return;
    window.FB.getLoginStatus(res =>{
      console.log(res)
      if(res.status === 'connected'){
        loginhandlerfacebook(res)
      }else{
        window.FB.login(loginhandlerfacebook,{scope:'public_profile,email'})
      }
    })
  };

  const loginhandlerfacebook = (res) =>{
    if(res.status === 'connected'){
      window.FB.api('/me?fields=id,name,email,picture',userdata =>{
        console.log(userdata)
      })
  }
}
  return (
    <div className="mt-11">
      <section className="bg-blueGray-50">
        <div className="w-full lg:w-4/12 px-4 mx-auto pt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Sign in with your credentials</small>
              </div>
              <form>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={user.email}
                    type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    value={user.password}
                    type="password"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 text-black"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {" "}
                    Sign In{" "}
                  </button>
                </div>
                <br /><br />
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sing in with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <GoogleLogin
                    clientId={clientIdGoogle}
                    render={(renderPros) => (
                      <button
                        onClick={renderPros.onClick}
                        disabled={renderPros.disabled}
                        className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                        type="button"
                      >
                        <img
                          alt="..."
                          className="w-5 mr-1"
                          src="https://demos.creative-tim.com/notus-js/assets/img/google.svg"
                        />
                        Google{" "}
                      </button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    cookiePolicy={'single_host_origin'}
                  />
                  <FacebookLogin
                    appId={clientIdFacebook}
                    fields="name,email,picture,id"
                    callback={responseFacebook} 
                    render={(props) => (
                      <button 
                      onClick={props.onClick}
                      className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                    >
                      <img
                        alt="..."
                        className="w-5 mr-1"
                        src="https://demos.creative-tim.com/notus-js/assets/img/github.svg"
                      />
                      Facebook{" "}
                    </button>
                  )}
                    />
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer className="relative pt-8 pb-6 mt-2">
          <div className="container mx-auto px-2">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <Link to="/register">No tienes cuenta?</Link>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Login;
