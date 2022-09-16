import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from './utils/firebaseConfig'

import Header from "./components/Header/Header";
import ManagementLoad from "./components/ManagementLoad/ManagementLoad";
import NewAgent from "./components/NewAgent/NewAgent";

function App() {

  const [agents, setAgents] = useState({});

  const getManagement = async () => {
    const docRef = doc(db, "listadoAsesores", "pXWMSXmrz7C2DWbo9I7E");
    const docSnap = await getDoc(docRef);

    docSnap.exists() ? setAgents(docSnap.data()) : console.log("No such document!")
  }

  useEffect(() => {

    getManagement();
  }, [])


  return (
    <>
      <Header />
      <ManagementLoad agents={agents} />
      <NewAgent agents={agents}/>
    </>
  );
}

export default App;
