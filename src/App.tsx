import DevPage from "./pages/DevPage.js";
import RunnerPage from "./pages/RunnerPage.js";

function App() {
  return window.location.pathname === "/dev"
    ? <DevPage />
    : <RunnerPage />;
}

export default App;