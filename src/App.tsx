import DevPage from "./pages/DevPage";
import RunnerPage from "./pages/RunnerPage";

function App() {
  return window.location.pathname === "/dev"
    ? <DevPage />
    : <RunnerPage />;
}

export default App;