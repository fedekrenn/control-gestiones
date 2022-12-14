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
import CaseList from "./components/CaseList/CaseList";

function App() {

  const [agents, setAgents] = useState({});
  const [cells, setCells] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [refresh, setRefresh] = useState(false);

  const getManagement = async () => {
    const docRef = doc(db, "listadoAsesores", "Svnqcl3BtN6xxZT2ggqw");
    const docSnap = await getDoc(docRef);

    docSnap.exists() ? setAgents(docSnap.data()) : console.log("No such document!") // eslint-disable-line no-unused-expressions
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

  useEffect(() => {

    getManagement()

  }, [refresh])


  return (
    <>
      <Header setToken={setToken} />
      <main>
        <Routes>
          <Route path="/" element={<Login token={token} setToken={setToken} />} />
          <Route path="/inicio" element={<ManagementLoad token={token} />} />
          <Route path="/nuevo-asesor" element={<NewAgent cells={cells} token={token} setRefresh={setRefresh} />} />
          <Route path="/nuevo-caso" element={<NewCase agents={agents} token={token} />} />
          <Route path="/listado-casos" element={<CaseList token={token} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
