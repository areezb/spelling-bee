import DevPage from "./pages/DevPage.js";
import RunnerPage from "./pages/RunnerPage.js";
import JsonEditorPage from "./pages/JsonEditorPage.js";

function App() {
  switch (window.location.pathname) {
    case "/dev":
      return <DevPage />;

    case "/editor":
      return <JsonEditorPage />;

    case "/run":
      return <RunnerPage/>;

    default:
      return <RunnerPage />;
  }
}

export default App;