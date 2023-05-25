import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loading, setLoading] = useState(true);
  const spinner = document.getElementById("spinner");
  if (spinner) {
    setTimeout(() => {
      spinner.style.display = "none";
      setLoading(false);
    }, 2000);
  }
  return (
    !loading && (
      <>
        <div>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          ></Toaster>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>

            <Route path="/editor/:roomId" element={<EditorPage />}></Route>
            <Route path="/dash" element={<Dashboard />}></Route>
          </Routes>
        </BrowserRouter>
      </>
    )
  );
}

export default App;
