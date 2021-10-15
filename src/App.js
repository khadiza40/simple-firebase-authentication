import { GoogleAuthProvider,updateProfile , sendEmailVerification, sendPasswordResetEmail, signInWithPopup, getAuth, GithubAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";


import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';

//initialized firebase function call
initializeAuthentication();

const googleProvider = new GoogleAuthProvider(); //for google sign up step 1 and also import it
const githubProvider = new GithubAuthProvider();



const auth = getAuth();


function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogIn] = useState(false);

  const handleGoogleSignIn = () => {


    signInWithPopup(auth, googleProvider)
      .then(result => {
        //  const user = result.user;
        //  console.log(user);

        //destructuring 
        const { displayName, email, photoURL } = result.user;

        //destructuring object
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        };


        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })

  }

  //this is the event handler
  const handleGithubSignIn = () => {

    signInWithPopup(auth, githubProvider)
      .then((result) => {
        //this gives a github access token. use it to access the github api
        //  const credential = GithubAuthProvider.credentialFromResult(result);
        //  const token = credential.accessToken;

        //the signed-in user info 
        //  const user = result.user;
        const { displayName, email, photoURL, phoneNumber } = result.user;

        const loggedInUser = {
          photo: photoURL,
          name: displayName,
          email: email,
          phone: phoneNumber

        }

        setUser(loggedInUser);

      })
      .catch((error) => {

        console.log(error.message);
      });

  }

  const handleGithubSignOut = () => {


    signOut(auth).then(() => {
      //sign-out successful
      setUser({});

    }).catch((error) => {
      //an error happened
    })
  }

  //email password authentication


  // const handleEmailandPassword = e => {
  // console.log(email, password);
  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     // Signed in 
  //     const user = userCredential.user;
  //     console.log(user);
  //   })
  //   .catch((error) => {
  //     // const errorCode = error.code;
  //     // const errorMessage = error.message;
  //     console.log(error.message);
  //   });
  // }



  const handleRegistration = e => {
    e.preventDefault();
    console.log(name, email, password);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password Must contain 2 upper case');
      return;
    }

    if (isLogin) {
      processLogin(email, password);
    }
    else {
      registerNewUser(email, password);
    }

  }


  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })

  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        //if successful then set error
        setError('');
        verifyEmail();
        setUserName ();

      })
      .catch(error => {
        setError(error.message);
      })
  }
 
//don't show this name in console
  const setUserName =  () => {
    updateProfile (auth.currentUser, {displayName: name }) 
    .then ( result => { 
      console.log(result);
    } )
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }


  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => { })
  }
  const toggleLogin = e => {
    // console.log(e.target.checked);
    setIsLogIn(e.target.checked);
  }


  const HandleEmailChange = e => {
    // console.log(e.target.value);
    setEmail(e.target.value);
  }


  const HandlePasswordChange = e => {
    // console.log(e.target.value);
    setPassword(e.target.value);
  }


  const HandleNameChange = e => {
    console.log(e.target.value);
    setName(e.target.value);
  }

  return (
    <div className="mx-5">


      <form onSubmit={handleRegistration}>
        <h2 className="text-primary">Please {isLogin ? 'Sign Up' : 'Sign In'} </h2>

{   ! isLogin &&
          <div className="row mb-3" >
          <br />
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input type="name" className="form-control" id="inputName" onFocus={HandleNameChange} required />
          </div>
        </div>
}



        <div className="row mb-3" >

          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="inputEmail3" onChange={HandleEmailChange} required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input type="password" className="form-control" id="inputPassword3" onBlur={HandlePasswordChange} required />
          </div>
        </div>


        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck1" onChange={toggleLogin} />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered ?
              </label>
            </div>
          </div>
        </div>
        <div className="row mb-3 text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Sign Up' : 'Sign In'}</button> <br /><br />
        <button type="button" className="btn btn-warning btn-sm" onClick={handleResetPassword}>Reset Password</button>
      </form>


      <br /><br /><br />
      <div>------------------------------------</div>

      <br /> <br /> <br /> <br /> <br />


      {/* making dynamic using ternary operator */}
      {!user.name ?
        <div>
          <button onClick={handleGoogleSignIn}>Google Sign In</button> <br /> <br />
          <button onClick={handleGithubSignIn}> Github Sign In </button> <br /> <br />

          <br />
        </div> :
        <button onClick={handleGithubSignOut}>Github Sign Out</button>
      }



      {
        user.email && <div>
          <img src={user.photo} alt="" />
          <h2>Welcome {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <h3>Your Phone: {user.phone}</h3>

        </div>


      }
    </div>
  );
}

export default App;
