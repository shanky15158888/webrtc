import { Routes, Route, Outlet } from "react-router-dom";
import Homepage from "./components/Homepage";
import Roompage from "./components/Roompage.jsx";
import { SocketProvider } from "./providers/Socket";
import "./App.css";
import { UserProvider } from "./providers/user.jsx";
import { PeerProvider } from "./providers/peer.jsx";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Homepage />}></Route>
              <Route path=":id" element={<Roompage />}></Route>
            </Routes>
          </UserProvider>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
