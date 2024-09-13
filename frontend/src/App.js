import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

//Login and Sign-up Page:
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./pages/LoginPage/ProtectedRoute";
import SignUpPage from "./pages/SignUpPage/SignUpPage";

//Homepage
import HomePage from "./pages/HomePage/HomePage";

//Risk Management System Page:
import RiskVerifPage from "./pages/RMSPage/VerificationPage/VerifPage";
import RiskResultPage from "./pages/RMSPage/ResultPage/ResultPage";
import RiskResultDetailPage from "./pages/RMSPage/ResultPage/Detail/ResultDetailPage";

//Data Management System Page:
import DataVerifPage from "./pages/DMDGSPage/DataPage/DataPage"
import DataResultPage from "./pages/DMDGSPage/ResultPage/ResultPage";
import DataResultDetailPage from "./pages/DMDGSPage/ResultPage/Detail/ResultDetailPage";

//Information Pages:
import LegalPage from "./pages/InfoPages/LegalPage/LegalPage";
import LLMInfoPage from "./pages/InfoPages/LLMInfoPage/LLMInfo";
import CompDataPage from "./pages/InfoPages/CompDataPage/CompDataPage";

import ErrorPage from "./pages/ErrorPage/ErrorPage";

const App = () => {
    return (
        <BrowserRouter basename="/qmsAIA">
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="*" element={<ErrorPage/>}/>
                {/* Protected routes */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/home" element={<HomePage/>}/>

                    <Route path="/risk_verif" element={<RiskVerifPage/>}/>
                    <Route path="/risk_result" element={<RiskResultPage/>}/>
                    <Route path="/risk_result_detail" element={<RiskResultDetailPage/>}/>

                    <Route path="/data_verif" element={<DataVerifPage/>}/>
                    <Route path="/data_result" element={<DataResultPage/>}/>
                    <Route path="/data_result_detail" element={<DataResultDetailPage/>}/>

                    <Route path="/legal" element={<LegalPage/>}/>
                    <Route path="/llmInfo" element={<LLMInfoPage/>}/>
                    <Route path="/compdata" element={<CompDataPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
