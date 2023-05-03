import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import db from './utils/firebaseConfig'
// Components
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MaingPage";
import NewAgent from "./pages/NewAgent/NewAgent";
import NewCase from "./pages/NewCase/NewCase";
import Login from "./pages/Login/Login";
import CaseList from "./pages/CaseList/CaseList";
import CaseDetail from "./pages/CaseDetail/CaseDetail";
import Search from "./pages/Search/Search";

function App() {

  const [agents, setAgents] = useState({});
  const [cells, setCells] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [refresh, setRefresh] = useState(false);

  const getManagement = async () => {
    const docRef = doc(db, "listadoAsesores", "Svnqcl3BtN6xxZT2ggqw");
    const docSnap = await getDoc(docRef);

    setRefresh(false);
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
      <Header setToken={setToken} hasToken={token} />
      <main>
        <Routes>
          <Route path="/" element={<Login token={token} setToken={setToken} />} />
          <Route path="/inicio" element={<MainPage token={token} />} />
          <Route path="/nuevo-asesor" element={<NewAgent cells={cells} token={token} setRefresh={setRefresh} />} />
          <Route path="/nuevo-caso" element={<NewCase agents={agents} token={token} />} />
          <Route path="/listado-casos" element={<CaseList token={token} />} />
          <Route path="/monitoreo/:id" element={<CaseDetail token={token} />} />
          <Route path="/busqueda-avanzada" element={<Search token={token} />} />
          <Route path="*" element={<h1>404, página no encontrada!</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
