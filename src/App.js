import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from './utils/firebaseConfig'

import Header from "./components/Header/Header";
import ManagementLoad from "./components/ManagementLoad/ManagementLoad";
import NewAgent from "./components/NewAgent/NewAgent";

function App() {

  const [agents, setAgents] = useState({});
  const [cells, setCells] = useState([]);

  const getManagement = async () => {
    const docRef = doc(db, "listadoAsesores", "Svnqcl3BtN6xxZT2ggqw");
    const docSnap = await getDoc(docRef);

    docSnap.exists() ? setAgents(docSnap.data()) : console.log("No such document!")
  }

  const getCells = async () => {
    const docRef = doc(db, "listadoAsesores", "4KpZYmZikVbntR1C1aiC");
    const docSnap = await getDoc(docRef);

    docSnap.exists() ? setCells(docSnap.data().celulas) : console.log("No such document!")
  }

  useEffect(() => {

    getManagement();
    getCells();
    
  }, [])


  return (
    <>
      <Header />
      <ManagementLoad agents={agents} />
      <NewAgent cells={cells}/>
    </>
  );
}

export default App;
