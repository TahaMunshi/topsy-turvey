import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { BASE_NAME } from "./constants/api";
import Home from "./pages/home";
import { store } from "./redux/store";

function AppRoutes() {
  return (
    <Provider store={store}>
      <BrowserRouter basename={BASE_NAME}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default AppRoutes;
