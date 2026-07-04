import "./Navbar.css"

export default function Navbar() {
  const path = window.location.pathname;

  return (
    <nav className="navbar">
      <div className="nav-title">
        Spelling Bee Toolkit
      </div>

      <div className="nav-links">
        <a href="/" className={path === "/" ? "active" : ""}>
          Home
        </a>

        <a
          href="/dev"
          className={path === "/dev" ? "active" : ""}
        >
          Package Builder
        </a>

        <a
          href="/editor"
          className={path === "/editor" ? "active" : ""}
        >
          Package Editor
        </a>

        <a
          href="/run"
          className={path === "/run" ? "active" : ""}
        >
          Competition Runner
        </a>
      </div>
    </nav>
  );
}