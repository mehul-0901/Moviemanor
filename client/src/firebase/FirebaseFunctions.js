import firebase from 'firebase/app';
import {storage} from './Firebase';


async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  await firebase.auth().currentUser.updateProfile({displayName: displayName});
}
async function addProfilePic(photoUrl,email)
{
  console.log(photoUrl);
  const uploadTask = storage.ref(`${email}/${photoUrl.name}`).put(photoUrl);
  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(progress);
    },
    error => {
      console.log(error);
    },
    () => {
      storage
        .ref(email)
        .child(photoUrl.name)
        .getDownloadURL()
        .then(url => {
           firebase.auth().currentUser.updateProfile({photoURL:url})
        });
    }
  );

}
async function doChangePassword(email, oldPassword, newPassword) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
 
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  await firebase.auth().signInWithPopup(socialProvider);
}

async function doPasswordReset(email) {
  try{
  await firebase.auth().sendPasswordResetEmail(email);
}
catch(e)
{
  throw `Provided email is not an User.`
}}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
  addProfilePic
};
