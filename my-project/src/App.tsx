import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import UserForm from "./components/Userform"; 
import Flow from "./components/flow";
import Table from "./components/table";
import { ReactFlowProvider } from "reactflow";

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4">
          <Routes>
            <Route path="/table" element={<Table />} />
            <Route path="/userform" element={<UserForm />} />
            <Route path="/flow" element={<Flow />} />
          </Routes>
        </div>
      </div>
    </Router>
    </ReactFlowProvider>
  );
};

export default App;