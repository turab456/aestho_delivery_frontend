import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import AppRoutes from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        newestOnTop
        draggable
        transition={Slide}
      />
    </BrowserRouter>
  );
};

export default App;
