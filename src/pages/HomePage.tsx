import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Spelling Bee Toolkit</h1>

      <p className="subtitle">
        A tool for creating, editing, and running spelling bees.
      </p>

      <div className="home-card">
        <h2>📖 Before You Begin</h2>

        <p>
          To generate competition packages, you'll need a{" "}
          <a
            href="https://dictionaryapi.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Merriam-Webster Dictionary API key
          </a>
          .
        </p>

        <ul>
          <li>Create a Merriam-Webster developer account.</li>
          <li>Request an API key.</li>
          <li>
            Make sure your key has access to the{" "}
            <strong>Collegiate Dictionary API</strong>.
          </li>
        </ul>

        <p>
          Once your API key is active, you can use Package Builder to generate
          competition packages.
        </p>
      </div>

      <div className="home-card">
        <h2>🛠 Package Builder</h2>

        <p>Create a new competition package from a list of words.</p>

        <ul>
          <li>Enter your Merriam-Webster API key.</li>
          <li>Copy in a list of words, one word per line.</li>
          <li>Download a complete competition package.</li>
        </ul>

        <button onClick={() => (window.location.href = "/dev")}>
          Open Package Builder
        </button>
      </div>

      <div className="home-card">
        <h2>✏️ Package Editor</h2>

        <p>Review and edit an existing competition package.</p>

        <ul>
          <li>Edit definitions and examples.</li>
          <li>Add and remove words.</li>
          <li>Save the updated package.</li>
        </ul>

        <button onClick={() => (window.location.href = "/editor")}>
          Open Package Editor
        </button>
      </div>

      <div className="home-card">
        <h2>🎤 Competition Runner</h2>

        <p>Load a competition package and run the spelling bee.</p>

        <ul>
          <li>Randomly select unused words.</li>
          <li>Play pronunciation audio.</li>
          <li>View definitions and examples.</li>
          <li>Track used words.</li>
        </ul>

        <button onClick={() => (window.location.href = "/run")}>
          Open Competition Runner
        </button>
      </div>

      <div className="workflow">
        <h2>Workflow</h2>

        <pre>
          {`Word List
    ↓
Package Builder
    ↓
competition.zip
    ↓
Package Editor (optional)
    ↓
competition.zip
    ↓
Competition Runner`}
        </pre>
      </div>

      <footer>Version 1.0</footer>
    </div>
  );
}
