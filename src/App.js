import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from './utils/firebaseConfig'
import { Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header/Header";
import ManagementLoad from "./components/ManagementLoad/ManagementLoad";
import NewAgent from "./components/NewAgent/NewAgent";
import NewCase from "./components/NewCase/NewCase";
import Login from "./components/Login/Login";

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

    docSnap.exists() ? setCells(docSnap.data()) : console.log("No such document!")
  }

  useEffect(() => {

    getManagement();
    getCells();

  }, [])


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<ManagementLoad agents={agents} />} />
        <Route path="/nuevo-asesor" element={<NewAgent cells={cells} />} />
        <Route path="/nuevo-caso" element={<NewCase agents={agents} />} />
      </Routes>
    </>
  );
}

export default App;
